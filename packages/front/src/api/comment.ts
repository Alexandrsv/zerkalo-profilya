import { instance } from "./axios-instance";
import { apiUrls } from "./api-configs";
import { IUser } from "./user";

export interface IComment {
  id: string;
  text: string;
  questionId: string;
  feedbackId: string;
  authorId?: number;
  author: Pick<IUser, "sex" | "age" | "profession">;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatCommentInput = Pick<
  IComment,
  "text" | "questionId" | "feedbackId" | "authorId" | "parentId"
>;

export const createCommentFetcher = async (comment: CreatCommentInput) => {
  return await instance.post<IComment>(apiUrls.comments, comment);
};

export const deleteCommentFetcher = async (commentId: string) => {
  return await instance.delete<IComment>(apiUrls.comments + commentId);
};
