import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateCommentBody,
  DeleteCommentParams,
} from "../schemas/comment.schema";
import {
  deleteComment,
  insertComment,
  selectCommentById,
} from "../services/comment.service";
import { getUserByVkId } from "../services/user.service";
import { getFeedbackById } from "../services/feedback.service";
import { Feedback, User } from "@prisma/client";
import { getQuestionById } from "../services/question.service";
import { sendCommentNotification } from "../services/notification.service";

export async function createCommentHandler(
  request: FastifyRequest<{
    Body: CreateCommentBody;
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  let user: User | null;
  let feedback: Feedback | null;

  try {
    [user, feedback] = await Promise.all([
      getUserByVkId(request.user.vk_user_id),
      getFeedbackById(request.body.feedbackId),
    ]);
  } catch (error) {
    console.log(error);
    return reply.code(404).send({ message: "Feedback or User not found" });
  }

  if (body.parentId) {
    const parentComment = await selectCommentById(body.parentId);
    if (!parentComment) {
      return reply.code(404).send({ message: "Parent comment not found" });
    }
  }

  if (!user) {
    return reply.code(404).send("User not found");
  }

  if (!feedback || request.body.questionId !== feedback.questionId) {
    return reply
      .code(400)
      .send({ message: "Something not found or bad request" });
  }

  const comment = await insertComment({
    ...body,
    questionId: feedback.questionId,
    feedbackId: feedback.id,
    authorId: user.id,
  });
  await sendCommentNotification({
    authorId: user.id,
    commentId: comment.id,
    feedbackId: feedback.id,
    questionId: feedback.questionId,
    parentCommentId: body.parentId,
  });
  return reply.code(200).send(comment);
}

export const deleteCommentHandler = async (
  request: FastifyRequest<{
    Params: DeleteCommentParams;
  }>,
  reply: FastifyReply
) => {
  const commentId = request.params.id;
  const user = await getUserByVkId(request.user.vk_user_id);
  const comment = await selectCommentById(commentId);

  if (!comment) {
    return reply.code(404).send({ message: "Comment not found" });
  }

  if (!comment.questionId) {
    return reply.code(400).send({ message: "Comment has no questionId" });
  }
  
  const question = await getQuestionById(comment.questionId);
  let parentComment: any = true;
  if (comment.parentId) {
    parentComment = await selectCommentById(comment.parentId);
  }
  if (!user || !parentComment || !question) {
    return reply.code(404).send({ message: "Something not found" });
  }
  if (question.authorId !== user.id && comment.authorId !== user.id) {
    return reply.code(403).send({ message: "Forbidden" });
  }
  return await deleteComment(commentId);
};
