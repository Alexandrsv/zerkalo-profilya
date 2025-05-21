import { FastifyInstance } from "fastify";
import {
  createFeedbackHandler,
  createQuestionHandler,
  deleteFeedbackHandler,
  deleteQuestionHandler,
  getQuestionHandler,
  getQuestionsHandler,
  patchQuestionHandler,
} from "../controllers/question.controller";
import { $ref } from "../schemas/question.schema";
import { getRateLimitConfig } from "../../rate-limit/get-rate-limit-config";

async function questionRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      schema: {
        querystring: $ref("questionsQueryStringSchema"),
        response: {
          "2xx": $ref("questionsSchema"),
        },
      },
    },
    getQuestionsHandler
  );
  server.get(
    "/:questionId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            questionId: { type: "string" },
          },
        },
        response: {
          "2xx": $ref("questionSchema"),
        },
      },
    },
    getQuestionHandler
  );

  //TODO: методы фидюека нужно удалить
  server.post(
    "/:questionId/feedback/",
    {
      schema: {
        // body: $ref("createFeedbackSchema"),
        params: {
          type: "object",
          properties: {
            questionId: { type: "string" },
          },
        },
        response: {
          "2xx": $ref("feedbackSchema"),
        },
      },
      config: {
        rateLimit: getRateLimitConfig(4, 3 * 45 * 1000),
      },
    },
    createFeedbackHandler
  );
  server.post(
    "/",
    {
      schema: {
        body: $ref("createQuestionSchema"),
        response: {
          "2xx": $ref("questionSchema"),
        },
      },
    },
    createQuestionHandler
  );
  server.patch(
    "/:questionId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            questionId: { type: "string" },
          },
        },
        body: $ref("updateQuestionSchema"),
      },
    },
    patchQuestionHandler
  );
  server.delete(
    "/:questionId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            questionId: { type: "string" },
          },
        },
      },
    },
    deleteQuestionHandler
  );
  server.delete("/:questionId/feedback/:feedbackId", deleteFeedbackHandler);
}

export default questionRoutes;
