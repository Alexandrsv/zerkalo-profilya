import axios from "axios";
import { selectCommentById } from "./comment.service";
import { getUserById } from "./user.service";
import { getFeedbackById } from "./feedback.service";

type SendNotificationInput = {
  questionId: string;
  userId: number;
  feedbackId: string;
  parentCommentId?: string;
};

export const sendNotification = async ({
  userId,
  questionId,
  feedbackId,
}: SendNotificationInput) => {
  const accessToken = process.env.ACCESS_TOKEN_APP;
  const randomId =
    questionId.replace(/[^0-9]/g, "").slice(0, 5) +
    feedbackId.replace(/[^0-9]/g, "").slice(0, 5);
  return await axios
    .get("https://api.vk.com/method/notifications.sendMessage", {
      params: {
        access_token: accessToken,
        user_ids: userId,
        message: `Ваш вопрос получил ответ!`,
        random_id: randomId,
        fragment: `/question/${questionId}`,
        v: "5.131",
      },
    })
    .catch((e) => console.error(JSON.stringify(e, null, 2)));
};

export interface ISendCommentNotificationInput {
  authorId: number;
  questionId: string;
  feedbackId: string;
  parentCommentId?: string;
  commentId: string;
}

//TODO: рефактор метода отправки, проброс ид коммента в урл, открытие на фронет

export const sendCommentNotification = async ({
  questionId,
  feedbackId,
  parentCommentId,
  commentId,
  authorId,
}: ISendCommentNotificationInput) => {
  let authorVkId: string;
  if (parentCommentId) {
    const parentComment = await selectCommentById(parentCommentId);
    const parentAuthor = await getUserById(parentComment!.authorId);
    if (parentAuthor && parentAuthor.id === authorId) return;
    authorVkId = parentAuthor!.vkId!;
  } else {
    const feedback = await getFeedbackById(feedbackId);
    const feedbackAuthor = await getUserById(feedback!.authorId);
    if (feedbackAuthor && feedbackAuthor.id === authorId) return;
    authorVkId = feedbackAuthor!.vkId!;
  }

  const accessToken = process.env.ACCESS_TOKEN_APP;
  const randomId =
    feedbackId.replace(/[^0-9]/g, "").slice(0, 5) +
    commentId.replace(/[^0-9]/g, "").slice(0, 5);

  const result = await axios
    .get("https://api.vk.com/method/notifications.sendMessage", {
      params: {
        access_token: accessToken,
        user_ids: authorVkId,
        message: `Ваш ${
          parentCommentId ? "комментарий" : "отзыв"
        } получил ответ!`,
        random_id: randomId,
        fragment: `/question/${questionId}`,
        v: "5.131",
      },
    })
    .catch((e) => console.error(JSON.stringify(e, null, 2)));
  console.log(JSON.stringify(result?.data, null, 2), {
    commentId,
    feedbackId,
    questionId,
    parentCommentId,
  });
  return result;
};
