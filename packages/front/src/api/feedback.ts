import { instance } from "./axios-instance";
import { apiUrls } from "./api-configs";
import { IUser } from "./user";
import { IComment } from "./comment";

// Базовый тип feedback
interface BaseFeedback {
  id: string;
  authorId: number;
  questionId: string;
  feedbackText: string;
  viewed?: boolean;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Анонимный feedback
export interface AnonymousFeedback extends BaseFeedback {
  isAnonymous: true;
  author?: Pick<IUser, "profession" | "age" | "sex">;
}

// Открытый feedback
export interface OpenFeedback extends BaseFeedback {
  isAnonymous: false;
  author?: Pick<IUser, "id" | "vkId" | "name" | "photo" | "isDon">;
}

// Union тип для feedback
export type IFeedback = AnonymousFeedback | OpenFeedback;

type CreateFeedbackInput = {
  authorId: string | number;
  feedbackText: string;
  questionId: string;
  isAnonymous?: boolean;
};

export const getFeedbackByIdFetcher = async (feedbackId: string) => {
  const { data } = await instance.get<IFeedback>(apiUrls.feedback + feedbackId);

  return data;
};

export const createQuestionFeedbackFetcher = async (
  data: CreateFeedbackInput
) => {
  return await instance
    .post<IFeedback>(apiUrls.feedback, data)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
       
      console.error(
        "Failed to create feedback:",
        e.response?.data || e.message
      );

      return null;
    });
};

export const deleteQuestionFeedbackFetcher = async (feedbackId: string) => {
  return await instance
    .delete<{ message: "Feedback deleted" }>(apiUrls.feedback + feedbackId)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
       
      console.error("Failed to delete feedback:", e.message);
    });
};
