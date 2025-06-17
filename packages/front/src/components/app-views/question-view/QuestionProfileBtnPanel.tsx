import React, { FC, useState } from "react";
import { Button, Div, Group, PanelSpinner, Text, Title } from "@vkontakte/vkui";
import QuestionInfo from "./QuestionInfo";
import { IQuestion } from "../../../api/questions";
import FeedbackItem from "./FeedbackItem";
import { Icon28ArrowDownOutline } from "@vkontakte/icons";
import { routes } from "../../../routes";
import { useNavigate, useParams } from "react-router-dom";
import { CreateFeedback } from "../../../hooks/use-question";
import { useQuestions } from "../../../hooks/use-questions";
import { useSnackbar } from "../../../hooks/use-snackbar";
import ym from "react-yandex-metrika";
import FeedbackCreate from "./FeedbackCreate";
import { useProfileBtnStore } from "../../../store/profileBtnStore";
import { IUser } from "../../../api/user";

const QuestionProfileBtnPanel: FC<{
  appUser: IUser;
  question?: IQuestion | null;
  createFeedback: CreateFeedback;
}> = ({ question, createFeedback }) => {
  const [vk_profile_id] = useProfileBtnStore((state) => [state.vk_profile_id]);
  const { questionId = "" } = useParams();
  const { questions, mutateQuestions } = useQuestions({
    authorVkId: vk_profile_id,
  });
  const navigate = useNavigate();
  const [isCreateFeedbackOpen, setIsCreateFeedbackOpen] = useState(false);
  const showSnackbar = useSnackbar();

  const [isSendLoading, setIsSendLoading] = useState(false);

  const onClickCreateFeedback = () => {
    setIsCreateFeedbackOpen((status) => !status);
  };

  const questionsWithoutAnswer = questions?.filter((q) => !q.isAnswered);

  const onSubmitFeedback = async (
    feedbackText: string,
    isAnonymous?: boolean
  ) => {
    setIsSendLoading(true);
    const response = await createFeedback(
      questionId,
      feedbackText,
      isAnonymous
    );

    if (response?.id) {
      await mutateQuestions();
      setIsCreateFeedbackOpen(false);
      ym("reachGoal", "create-btn-profile-feedback");

      if (questionsWithoutAnswer?.length && questionsWithoutAnswer.length > 1) {
        navigate(
          "/question/" +
            questionsWithoutAnswer.filter((q) => q.id !== question?.id)[0].id
        );
      } else {
        navigate(routes["no-more-questions"]);
      }
    } else {
      showSnackbar({
        text: "Вы слишком часто отправляете ответы. Попробуйте позже",
        variant: "error",
      });
    }
    setIsSendLoading(false);
  };

  return (
    <Group>
      {!!question && (
        <div>
          <QuestionInfo question={question}>
            <Title level={"3"} className={"pb-3 "}>
              <div className={"flex justify-center items-center"}>
                <div>Прочтите вопрос:</div>
                <Icon28ArrowDownOutline className={`px-3`} />
              </div>
            </Title>
          </QuestionInfo>
          <div className={"flex flex-col py-2 justify-center items-center"}>
            <Icon28ArrowDownOutline className={`my-2 `} />

            <Text className={"w-auto text-center px-2"}>
              Старайтесь описывать лично ваши эмоции и мысли,
              <br /> а не только то, что считаете правильным
            </Text>
            <Icon28ArrowDownOutline className={`my-2`} />
            {!isCreateFeedbackOpen && (
              <>
                <Button onClick={onClickCreateFeedback} size={"m"}>
                  Ответить
                </Button>
                <Div>
                  <Text className={"text-center !text-xs"}>
                    Ответ <b>анонимный</b>
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

export default QuestionProfileBtnPanel;
