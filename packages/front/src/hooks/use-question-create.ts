import { createQuestionFetcher, QuestionInput } from "../api/questions";
import { useAppUser } from "./use-app-user";
import { useSWRConfig } from "swr";
import ym from "react-yandex-metrika";

export const useQuestionCreate = () => {
  const { user } = useAppUser();
  const { mutate } = useSWRConfig();
  const createQuestion = async (question: QuestionInput) => {
    const newQuestion = await createQuestionFetcher(question);
    if (newQuestion?.id) {
      ym("reachGoal", "create-question");
    }
    await mutate([`/questions`, user?.id, JSON.stringify({ owner: true })]);
    return newQuestion;
  };

  return { createQuestion };
};
