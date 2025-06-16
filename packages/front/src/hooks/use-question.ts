import useSWR from "swr";
import {
  getQuestionFetcher,
  IQuestion,
  patchQuestionFetcher,
  QuestionUpdateInput,
} from "../api/questions";
import { useAppUser } from "./use-app-user";
import { useContext } from "react";
import AlertContext, { ContentAlertProps } from "../context/AlertContext";
import { useQuestions } from "./use-questions";
import { useSnackbar } from "./use-snackbar";
import {
  createQuestionFeedbackFetcher,
  deleteQuestionFeedbackFetcher,
  IFeedback,
} from "../api/feedback";

export type UpdateQuestion = (
  questionId: string,
  params: QuestionUpdateInput
) => Promise<IQuestion>;

export type CreateFeedback = (
  questionId: string,
  feedbackText: string,
  isAnonymous?: boolean
) => Promise<IFeedback | null>;

export const useQuestion = (questionId: string | undefined) => {
  const { mutateQuestions } = useQuestions({ owner: false });
  const { user } = useAppUser();
  const { setActiveAlert } = useContext(AlertContext);
  const showSnackbar = useSnackbar();
  const {
    data,
    mutate: mutateQuestion,
    error,
  } = useSWR(questionId ? `/questions/${questionId}` : null, () =>
    getQuestionFetcher(questionId || "")
  );

  const updateQuestion: UpdateQuestion = async (questionId, params) => {
    const newQuestion = await patchQuestionFetcher(questionId, params);
    await mutateQuestion();
    await mutateQuestions();

    return newQuestion;
  };

  const createFeedback: CreateFeedback = async (
    questionId,
    feedbackText,
    isAnonymous = true
  ) => {
    const response = await createQuestionFeedbackFetcher({
      authorId: user?.id || 0,
      feedbackText,
      questionId,
      isAnonymous,
    });

    if (response?.id) {
      void Promise.all([mutateQuestion(), mutateQuestions()]);
    }

    return response;
  };

  const deleteFeedback = async (feedbackId: string) => {
    const removeFeedbackCb = async () => {
      const response = await deleteQuestionFeedbackFetcher(feedbackId);

      if (response && response?.message === "Feedback deleted") {
        void (await mutateQuestion());
        void (await mutateQuestions());
        showSnackbar({ text: "Ответ удален", variant: "error" });
      } else {
        showSnackbar({ text: "Нет прав на удаление", variant: "error" });
      }

      return response;
    };
    const content: ContentAlertProps = {
      actionText: "Удалить",
      header: "Удалить обратную связь?",
      text: "Вы уверены, что хотите удалить ответ?",
    };
    setActiveAlert(removeFeedbackCb, content);
  };

  let question: IQuestion | null | undefined = data;

  if (error && error?.response?.status?.toString().includes("40"))
    question = null;

  return { createFeedback, question, deleteFeedback, updateQuestion };
};
