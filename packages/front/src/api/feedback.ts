import { instance } from "./axios-instance";
import { apiUrls } from "./api-configs";
import { IUser } from "./user";
import { IComment } from "./comment";

type CreateFeedbackInput = {
  authorId: string | number;
  feedbackText: string;
  questionId: string;
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
      console.log(e.response.data);
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
      console.log(e);
    });
};

export interface IFeedback {
  id: string;
  authorId?: number;
  author: Pick<IUser, "profession" | "age" | "sex">;
  questionId: string;
  feedbackText: string;
  viewed?: boolean;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}
