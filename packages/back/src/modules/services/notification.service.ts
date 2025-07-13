import axios from "axios";
import { selectCommentById } from "./comment.service";
import { getUserById } from "./user.service";
import { getFeedbackById } from "./feedback.service";

// Функция для ретраев с экспоненциальной задержкой
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        console.error(`Final attempt failed after ${maxRetries} retries:`, error);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

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
  
  return await retryWithBackoff(
    () =>
      axios.get("https://api.vk.com/method/notifications.sendMessage", {
        params: {
          access_token: accessToken,
          user_ids: userId,
          message: `Ваш вопрос получил ответ!`,
          random_id: randomId,
          fragment: `/question/${questionId}`,
          v: "5.131",
        },
      }),
    5, // 5 ретраев
    1000 // начальная задержка 1 секунда
  ).catch((e) => {
    console.error(
      "sendNotification failed after all retries:",
      JSON.stringify(e, null, 2)
    );
    return null;
  });
};

export interface ISendCommentNotificationInput {
  authorId: number;
  questionId: string;
  feedbackId: string;
  parentCommentId?: string | null;
  commentId: string;
}

//TODO: рефактор метода отправки, проброс ид коммента в урл, открытие на фронте

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

  const result = await retryWithBackoff(
    () =>
      axios.get("https://api.vk.com/method/notifications.sendMessage", {
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
      }),
    5, // 5 ретраев
    1000 // начальная задержка 1 секунда
  ).catch((e) => {
    console.error(
      "sendCommentNotification failed after all retries:",
      JSON.stringify(e, null, 2)
    );
    return null;
  });
  console.log(JSON.stringify(result?.data, null, 2), {
    commentId,
    feedbackId,
    questionId,
    parentCommentId,
  });
  return result;
};
