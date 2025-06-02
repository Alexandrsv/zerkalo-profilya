import React, { FC, useEffect, useState } from "react";
import { Button, Div, Group, PanelSpinner, Text, Title } from "@vkontakte/vkui";
import QuestionInfo from "./QuestionInfo";
import { IQuestion } from "../../../api/questions";
import FeedbackItem from "./FeedbackItem";
import { Icon28ArrowDownOutline } from "@vkontakte/icons";
import { routes } from "../../../routes";
import { useNavigate, useParams } from "react-router-dom";
import { CreateFeedback } from "../../../hooks/use-question";
import { useQuestions } from "../../../hooks/use-questions";
import { useAppUser } from "../../../hooks/use-app-user";
import { useSnackbar } from "../../../hooks/use-snackbar";
import ym from "react-yandex-metrika";
import FeedbackCreate from "./FeedbackCreate";

type Steps =
  | "read-question"
  | "explore-profile"
  | "explore-pending"
  | "send-feedback"
  | "next-question";
const QuestionPanel: FC<{
  question?: IQuestion | null;
  createFeedback: CreateFeedback;
}> = ({ question, createFeedback }) => {
  let { questionId = "" } = useParams();
  const { questions } = useQuestions({ owner: false });
  const navigate = useNavigate();
  const { user } = useAppUser();
  const [isCreateFeedbackOpen, setIsCreateFeedbackOpen] = useState(false);
  const showSnackbar = useSnackbar();

  const [step, setStep] = useState<Steps>("read-question");
  const [isSendLoading, setIsSendLoading] = useState(false);

  const isReadQuestion = step === "read-question";
  const isExplorePending = step === "explore-pending";
  const isExploreProfile = step === "explore-profile";
  const isSendFeedback = step === "send-feedback";
  const isNextQuestion = step === "next-question";

  const isDev = import.meta.env.MODE !== "production";
  const readQuestionTimeout = isDev ? 0 : 2000;
  const exploreProfileTimeout = isDev ? 0 : 10000;

  useEffect(() => {
    setStep("read-question");
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isReadQuestion) {
      timeout = setTimeout(() => {
        setStep("explore-profile");
      }, readQuestionTimeout);
    }
    return () => clearTimeout(timeout);
  }, [isReadQuestion, readQuestionTimeout]);

  useEffect(() => {
    if (isNextQuestion) {
      // Если нет онбординга, вместо следующего вопроса - переход на страницу с онбордингом
      if (user && !user.flags?.includes("IS_ONBOARDED")) {
        return navigate(routes.onboarding_1);
      }

      const nextQuestions = questions?.filter((q) => q.id !== question?.id);
      const nextQuestion =
        nextQuestions?.[Math.floor(Math.random() * nextQuestions.length)];
      if (nextQuestion) {
        showSnackbar({ text: "Ответ на вопрос отправлен" });
        navigate("/question/" + nextQuestion.id);
        setStep("read-question");
      } else {
        navigate("/feed");
        setStep("read-question");
      }
    }
  }, [
    isExploreProfile,
    isNextQuestion,
    isReadQuestion,
    navigate,
    question?.id,
    questions,
    showSnackbar,
    user,
    user?.flags,
  ]);

  const onOpenTarget = () => {
    setStep("explore-pending");
    setTimeout(() => {
      setStep("send-feedback");
    }, exploreProfileTimeout);

    window.open(question?.targetUrl, "_blank");
  };

  const onClickCreateFeedback = () => {
    setIsCreateFeedbackOpen((status) => !status);
  };

  const onSubmitFeedback = async (feedbackText: string) => {
    setIsSendLoading(true);
    const response = await createFeedback(questionId, feedbackText);
    if (response?.id) {
      setIsCreateFeedbackOpen(false);
      ym("reachGoal", "create-feedback");
      setStep("next-question");
    } else {
      showSnackbar({
        text: "Вы слишком часто отправляете ответы. Попробуйте позже",
        variant: "error",
      });
    }
    setIsSendLoading(false);
  };

  const skipQuestion = () => {
    ym("reachGoal", "skip-question");
    setStep("next-question");
  };

  return (
    <Group>
      {!!question && (
        <div>
          <QuestionInfo question={question}>
            <Title level={"3"} className={"pb-3 "}>
              <div className={"flex justify-center items-center"}>
                <div>Прочтите вопрос:</div>
                <Icon28ArrowDownOutline
                  className={`px-3 ${isReadQuestion && "animate-bounce"}`}
                  fill={!isReadQuestion ? "gray" : ""}
                />
              </div>
            </Title>
          </QuestionInfo>
          <div className={"flex justify-end w-full box-border px-4"}>
            <Button
              onClick={skipQuestion}
              disabled={isReadQuestion}
              appearance={"accent"}
              mode={"tertiary"}
              size={"m"}
            >
              Пропустить
            </Button>
          </div>
          <div className={"flex flex-col py-2 justify-center items-center"}>
            <Icon28ArrowDownOutline
              className={`my-2 ${
                (isExploreProfile || isExplorePending) && "animate-bounce"
              }`}
              fill={!isExploreProfile ? "gray" : ""}
            />

            <Button onClick={onOpenTarget} disabled={isReadQuestion} size={"m"}>
              Изучить профиль
            </Button>

            {isExplorePending && (
              <Text className={"pt-4"}>
                Перед ответом внимательно изучите профиль
              </Text>
            )}
            {isSendFeedback && (
              <Text className={"pt-4 w-auto text-center px-2"}>
                Старайтесь описывать лично ваши эмоции и мысли, а не только то,
                что считаете правильным
              </Text>
            )}
            <Icon28ArrowDownOutline
              className={`my-2 ${isSendFeedback && "animate-bounce"}`}
              fill={!isSendFeedback ? "gray" : ""}
            />
            {!isCreateFeedbackOpen && (
              <>
                <Button
                  onClick={onClickCreateFeedback}
                  disabled={!isSendFeedback}
                  size={"m"}
                >
                  Ответить
                </Button>
                <Div>
                  <Text className={"text-center !text-xs"}>
                    Ответ анонимный <br />
                    автор вопроса увидит только ваш пол, профессию и возраст
                  </Text>
                </Div>
              </>
            )}
          </div>
          {isCreateFeedbackOpen && (
            <FeedbackCreate
              onSubmit={onSubmitFeedback}
              isLoading={isSendLoading}
              onCancel={() => setIsCreateFeedbackOpen(false)}
            />
          )}
          <Div>
            {question?.feedback.map((feedback, i) => (
              <FeedbackItem
                key={feedback.id}
                feedback={feedback}
                questionId={question.id}
                questionText={question.questionText}
                withoutSeparator={question.feedback.length === i + 1}
                isQuestionAuthor={false}
              />
            ))}
          </Div>
        </div>
      )}
      {!question && <PanelSpinner />}
    </Group>
  );
};

export default QuestionPanel;
