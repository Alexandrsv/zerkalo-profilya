import { FastifyReply, FastifyRequest } from "fastify";
import { getQuestionById } from "../services/question.service";
import { checkAuthorAccess } from "../../utils/check-author-access";
import {
  createFeedback,
  deleteFeedbackById,
  getFeedbackById,
} from "../services/feedback.service";
import {
  CreateFeedbackInput,
  DeleteFeedbackParams,
  FeedbackParams,
} from "../schemas/feedback.schema";

export async function getFeedbackHandler(
  request: FastifyRequest<{ Params: FeedbackParams }>,
  reply: FastifyReply
) {
  const feedbackId = request.params.id;

  try {
    const feedback = await getFeedbackById(feedbackId, true);
    if (feedback) {
      return reply.code(200).send(feedback);
    } else {
      return reply.code(404).send({ message: "Feedback not found" });
    }
  } catch (error) {
    console.log(error);
    return reply.code(500).send(error);
  }
}

export async function createFeedbackHandler(
  request: FastifyRequest<{
    Body: CreateFeedbackInput;
  }>,
  reply: FastifyReply
) {
  const {
    questionId,
    authorId,
    feedbackText,
    isAnonymous = true,
  } = request.body;

  try {
    if (await checkAuthorAccess(authorId, request.user)) {
      const question = await getQuestionById(questionId);
      const questionAuthor = question?.author.vkId || undefined;
      if (question && question.authorId === authorId) {
        return reply
          .code(403)
          .send({ message: "Forbidden, you question author" });
      }
      return await createFeedback({
        questionId,
        questionAuthor,
        feedbackText,
        authorId,
        isAnonymous,
      });
    } else {
      return reply.code(403).send({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const deleteFeedbackHandler = async (
  request: FastifyRequest<{
    Params: DeleteFeedbackParams;
  }>,
  reply: FastifyReply
) => {
  const feedbackId = request.params.id;

  const feedback = await getFeedbackById(feedbackId);
  if (!feedback) {
    return reply.code(404).send({ message: "Feedback not found" });
  }
  const question = await getQuestionById(feedback.questionId);

  const isFeedbackAuthor = await checkAuthorAccess(
    feedback?.authorId,
    request.user
  );

  const isQuestionAuthor = question?.authorId 
    ? await checkAuthorAccess(question.authorId, request.user)
    : false;
  const isAllowed = isFeedbackAuthor || isQuestionAuthor;

  if (!isAllowed) {
    return { statusCode: 403, error: "Forbidden!" };
  } else {
    try {
      await deleteFeedbackById(feedbackId);
      return { message: "Feedback deleted" };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
