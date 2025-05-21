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
  if ((!body.feedbackId && !body.questionId) || !body.questionId) {
    return reply.code(400).send("Bad request");
  }
  if (await checkAuthorAccess(body.authorId, request.user)) {
    try {
      const question = await getQuestionById(body.questionId);
      if (!question) {
        return reply.code(404).send("Question not found");
      }
    } catch (e) {
      return reply.code(404).send("Question not found");
    }
    try {
      const abuse = await createAbuse(body);
      if (abuse) {
        return reply.code(200).send(abuse);
      }
    } catch (error) {
      console.log(error);
      return reply.code(500).send(error);
    }
  } else {
    return reply.code(403).send("Forbidden");
  }
}
