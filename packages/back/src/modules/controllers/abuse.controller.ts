import { FastifyReply, FastifyRequest } from "fastify";
import { createAbuse } from "../services/abuse.service";

import { CreateAbuseInput } from "../schemas/abuse.schema";
import { checkAuthorAccess } from "../../utils/check-author-access";
import { getQuestionById } from "../services/question.service";

export async function createAbuseReport(
  request: FastifyRequest<{ Body: CreateAbuseInput }>,
  reply: FastifyReply
) {
  const body = request.body;
  
  if (!body.questionId) {
    return reply.code(400).send({
      error: "Bad request",
      message: "questionId is required",
    });
  }

  try {
    // Проверяем доступ автора
    const hasAccess = await checkAuthorAccess(body.authorId, request.user);
    if (!hasAccess) {
      return reply.code(403).send({
        error: "Forbidden",
        message: "Access denied for this user",
      });
    }

    // Проверяем существование вопроса
    try {
      const question = await getQuestionById(body.questionId);
      if (!question) {
        return reply.code(404).send({
          error: "Not Found",
          message: "Question not found",
        });
      }
    } catch (e) {
      console.error("Error fetching question:", e);
      return reply.code(404).send({
        error: "Not Found",
        message: "Question not found",
      });
    }

    // Создаем жалобу
    try {
      const abuse = await createAbuse(body);
      if (abuse) {
        return reply.code(200).send(abuse);
      } else {
        return reply.code(500).send({
          error: "Internal Server Error",
          message: "Failed to create abuse report",
        });
      }
    } catch (error) {
      console.error("Error creating abuse report:", error);
      return reply.code(500).send({
        error: "Internal Server Error",
        message: "Failed to create abuse report",
      });
    }
  } catch (error) {
    console.error("Unexpected error in createAbuseReport:", error);
    return reply.code(500).send({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
}
