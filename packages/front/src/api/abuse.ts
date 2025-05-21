import { instance } from "./axios-instance";
import { apiUrls } from "./api-configs";

export interface IAbuse {
  id: string;
  text: string;
  feedbackId?: string;
  questionId?: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export type IAbuseInput = Omit<IAbuse, "id" | "createdAt" | "updatedAt">;

export const postAbuseFetcher = async (params: IAbuseInput) => {
  return await instance.post<IAbuse>(apiUrls.abuse, params).catch((res) => {
    return res.response;
  });
};
