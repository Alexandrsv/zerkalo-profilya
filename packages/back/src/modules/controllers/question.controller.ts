import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateQuestionInput,
  questionSchema,
  QuestionsQueryString,
} from "../schemas/question.schema";
import {
  createQuestion,
  deleteQuestionById,
  getQuestionById,
  getQuestionsByAuthorVKID,
  getQuestionsFeed,
  updateAppCounterHandler,
  updateQuestion,
} from "../services/question.service";
import { checkAuthorAccess } from "../../utils/check-author-access";
import {
  createFeedback,
  deleteFeedbackById,
  getFeedbackById,
} from "../services/feedback.service";
import { CreateFeedbackInput } from "../schemas/feedback.schema";

//TODO: можно ли смотреть вопросы чужого профиля? Типа скрытые не возвращать
export async function getQuestionsHandler(
  request: FastifyRequest<{
    Querystring: QuestionsQueryString;
  }>,
  reply: FastifyReply
) {
  const answersAuthorVKID = request.user?.vk_user_id;
  try {
    let questions;
    if (request.query.authorVkId && answersAuthorVKID) {
      questions = await getQuestionsByAuthorVKID(
        request.query.authorVkId,
        answersAuthorVKID,
        true
      );

      return reply.send(questions || []);
    }
    if (request.query.owner && request.user.vk_user_id) {
      questions = await getQuestionsByAuthorVKID(
        request.user.vk_user_id,
        answersAuthorVKID
      );
    } else {
      questions = await getQuestionsFeed(request.user.vk_user_id);
    }
    reply.code(200).send(questions);
  } catch (error) {
    console.log(error);
    reply.code(500).send(error);
  }
}

export async function getQuestionHandler(
  request: FastifyRequest<{
    Params: { questionId: string };
  }>,
  reply: FastifyReply
) {
  const questionId = request.params.questionId;

  if (questionId.length === 36) {
    try {
      const question = await getQuestionById(questionId);
      if (question) {
        const parsed = questionSchema.parse(question);

        reply.code(200).send(parsed);
        if (question.author.vkId === request.user.vk_user_id) {
          await updateAppCounterHandler({
            questionId,
            authorId: question.author.id,
            vkId: request.user.vk_user_id,
          });
        }
      } else {
        reply.code(404).send({ message: "Question not found" });
      }
    } catch (error) {
      console.log(error);
      reply.code(500).send(error);
    }
  } else {
    reply.code(400).send({ statusCode: 400, error: "Bad request" });
  }
}

export async function createQuestionHandler(
  request: FastifyRequest<{
    Body: CreateQuestionInput;
  }>,
  reply: FastifyReply
) {
  const body = {
    ...request.body,
    targetUrl: `https://vk.com/id${request.user.vk_user_id}`,
  }; // игнор таргета из тела, пока редактирования поля нет

  try {
    const isAllowed = await checkAuthorAccess(body.authorId, request.user);
    if (isAllowed) {
      const newQuestion = await createQuestion(body);
      reply.code(201).send(newQuestion);
    } else {
      reply.code(403).send({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    reply.code(500).send(error);
  }
}

export const patchQuestionHandler = async (
  request: FastifyRequest<{
    Params: { questionId: string };
    Body: CreateQuestionInput;
  }>,
  reply: FastifyReply
) => {
  const questionId = request.params.questionId;

  if (questionId.length === 36) {
    const body = request.body;
    const question = await getQuestionById(questionId);

    if (!question) return { statusCode: 404, message: "Question not found" };

    const isAllowed = question.author.vkId === request.user.vk_user_id;
    if (isAllowed) {
      try {
        return await updateQuestion(questionId, body);
      } catch (error) {
        console.log(error);
        return error;
      }
    } else {
      reply.code(403).send({ message: "Forbidden" });
    }
  } else {
    return { statusCode: 400, error: "Bad request" };
  }
};

export async function deleteQuestionHandler(
  request: FastifyRequest<{ Params: { questionId: string } }>,
  reply: FastifyReply
) {
  const questionId = request.params.questionId;
  try {
    const question = await getQuestionById(questionId);
    if (question?.author.vkId !== request.user.vk_user_id) {
      return reply.code(403).send({ message: "Forbidden" });
    }
    if (question) {
      void (await deleteQuestionById(questionId));
      reply.code(200).send({ message: "Его больше нет" });
    } else {
      reply.code(204).send({ message: "Question not found" });
    }
  } catch (error) {
    console.log(error);
    reply.code(500).send(error);
  }
  reply.send("newQuestion");
}

export async function createFeedbackHandler(
  request: FastifyRequest<{
    Params: { questionId: string };
    Body: CreateFeedbackInput;
  }>,
  reply: FastifyReply
) {
  const questionId = request.params.questionId;
  const { questionId: _, ...body } = request.body;

  if (questionId.length === 36) {
    try {
      if (
        body.authorId &&
        (await checkAuthorAccess(body.authorId, request.user))
      ) {
        const question = await getQuestionById(questionId);
        if (question && question.authorId === body.authorId) {
          return reply
            .code(403)
            .send({ message: "Forbidden, you question author" });
        }
        const questionAuthor = question?.author.vkId || "";
        return await createFeedback({
          questionId,
          questionAuthor,
          ...body,
          isAnonymous: body.isAnonymous ?? true,
        });
      } else {
        reply.code(403).send({ message: "Forbidden" });
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  } else {
    return { statusCode: 400, error: "Bad request" };
  }
}

export const deleteFeedbackHandler = async (
  request: FastifyRequest<{
    Params: { questionId: string; feedbackId: string };
  }>,
  reply: FastifyReply
) => {
  const questionId = request.params.questionId;
  const feedbackId = request.params.feedbackId;

  const feedback = await getFeedbackById(feedbackId);
  const question = await getQuestionById(questionId);

  if (!feedback) {
    return reply.code(404).send({ message: "Feedback not found" });
  }

  const isFeedbackAuthor = await checkAuthorAccess(
    feedback?.authorId || 0,
    request.user
  );
  const isQuestionAuthor = await checkAuthorAccess(
    question?.authorId || 0,
    request.user
  );
  const isAllowed = isFeedbackAuthor || isQuestionAuthor;

  if (!isAllowed) {
    return { statusCode: 403, error: "Forbidden!" };
  } else {
    if (questionId.length === 36 && feedbackId.length === 36) {
      try {
        await deleteFeedbackById(feedbackId);
        return { message: "Feedback deleted" };
      } catch (error) {
        console.log(error);
        return error;
      }
    } else {
      return { statusCode: 400, error: "Bad request" };
    }
  }
};
