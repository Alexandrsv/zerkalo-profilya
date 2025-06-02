import useSWR from "swr";
import {
  deleteQuestionFetcher,
  getQuestionsFetcher,
  QuestionsSearchParams,
} from "../api/questions";
import { useAppUser } from "./use-app-user";
import { useContext } from "react";
import AlertContext, { ContentAlertProps } from "../context/AlertContext";

export const useQuestions = (params: QuestionsSearchParams) => {
  const { user } = useAppUser();
  const { setActiveAlert } = useContext(AlertContext);

  const key: [string, number | undefined, string] = [
    "/questions",
    user?.id,
    JSON.stringify(params),
  ];
  
  const {
    data: questions,
    error,
    mutate: mutateQuestions,
  } = useSWR(user?.id ? key : null, () => getQuestionsFetcher(params));

  const removeQuestion = async (questionId: string) => {
    const removeQuestionCb = async () => {
      const removedQuestion = await deleteQuestionFetcher(questionId);

      if (questions && removedQuestion) {
        await mutateQuestions(
          [...questions.filter((q) => q.id !== questionId)],
          {
            revalidate: false,
          }
        );
      }
    };
    const content: ContentAlertProps = {
      actionText: "Удалить",
      header: "Удалить вопрос?",
      text: "Вы уверены, что хотите удалить вопрос и ответы на него?",
    };
    setActiveAlert(removeQuestionCb, content);
  };

  return {
    questions,
    error,
    mutateQuestions,
    removeQuestion,
  };
};
