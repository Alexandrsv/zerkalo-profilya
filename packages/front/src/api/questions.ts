import { instance } from "./axios-instance";
import { apiUrls } from "./api-configs";
import { IUser } from "./user";
import { IFeedback } from "./feedback";

export const getQuestionsFetcher = async (params?: QuestionsSearchParams) => {
  const { data } = await instance.get<IQuestion[]>(apiUrls.questions, {
    params,
  });
  return data;
};

export const getQuestionFetcher = async (questionId: string) => {
  const { data } = await instance.get<IQuestion>(apiUrls.question(questionId));
  return data;
};

export const createQuestionFetcher = async (
  newQuestion: Pick<
    IQuestion,
    "authorId" | "questionText" | "targetUrl" | "targetSex" | "isActive"
  >
) => {
  const { data: newQuestionResponse } = await instance.post<IQuestion>(
    apiUrls.questions,
    { ...newQuestion }
  );

  return newQuestionResponse;
};

export const patchQuestionFetcher = async (
  questionId: string,
  params: QuestionUpdateInput
) => {
  const { data } = await instance.patch<IQuestion>(
    apiUrls.question(questionId),
    params
  );
  return data;
};

export const deleteQuestionFetcher = async (questionId: string) => {
  const { data } = await instance.delete<IQuestion>(
    apiUrls.question(questionId)
  );
  return data;
};

export type QuestionsSearchParams =
  | {
      owner: boolean;
    }
  | {
      authorVkId: string;
    };

export interface IQuestion {
  isAnswered?: boolean;
  id: string;
  authorId: string;
  questionText: string;
  targetUrl: string;
  targetSex?: string; // 0-любой, 1-мужчины, 2-женщины
  author: IUser;
  feedback: Array<Omit<IFeedback, "authorId">>;
  feedbackCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QuestionUpdateInput = Partial<
  Pick<IQuestion, "questionText" | "targetUrl" | "targetSex" | "isActive">
>;

export type QuestionInput = Pick<
  IQuestion,
  "authorId" | "questionText" | "targetUrl" | "targetSex" | "isActive"
>;
