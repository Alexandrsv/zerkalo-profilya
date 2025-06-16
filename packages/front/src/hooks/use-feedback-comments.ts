import useSWR from "swr";
import { getFeedbackByIdFetcher, IFeedback } from "../api/feedback";
import {
  CreatCommentInput,
  createCommentFetcher,
  deleteCommentFetcher,
} from "../api/comment";

export const useFeedbackComments = (feedbackId?: string) => {
  const {
    data: feedback,
    error,
    mutate,
  } = useSWR<IFeedback>(feedbackId ? feedbackId : null, getFeedbackByIdFetcher);

  const createNewComment = async (newComment: CreatCommentInput) => {
    const createResponse = await createCommentFetcher(newComment);

    if (createResponse.status === 200) {
      await mutate();
    }
    console.log(createResponse);

    return createResponse?.data;
  };

  const deleteComment = async (commentId: string) => {
    const deleteResponse = await deleteCommentFetcher(commentId);

    if (deleteResponse.status === 200) {
      await mutate();
    }

    return deleteResponse?.data;
  };

  const comments = feedback?.comments;

  return {
    feedback,
    createNewComment,
    deleteComment,
    comments,
    error,
    mutate,
  };
};
