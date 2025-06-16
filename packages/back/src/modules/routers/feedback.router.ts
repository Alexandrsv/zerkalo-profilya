import { FastifyInstance } from "fastify";

import { getRateLimitConfig } from "../../rate-limit/get-rate-limit-config";
import { $ref } from "../schemas/feedback.schema";
import {
  createFeedbackHandler,
  deleteFeedbackHandler,
  getFeedbackHandler,
} from "../controllers/feedback.controller";

async function feedbackRouter(server: FastifyInstance) {
  //TODO: добавить флаг canDelete для комментариев, учитывать на фронте
  server.get(
    "/:id",
    {
      schema: {
        params: $ref("feedbackParamsSchema"),
        response: {
          "2xx": $ref("anonymousFeedbackSchema"),
        },
      },
    },
    getFeedbackHandler
  );

  server.post(
    "/",
    {
      schema: {
        body: $ref("createFeedbackSchema"),
        response: {
          // "2xx": $ref("feedbackSchema"),
        },
      },
      config: {
        rateLimit: getRateLimitConfig(4, 3 * 45 * 1000),
      },
    },
    createFeedbackHandler
  );
  server.delete(
    "/:id",
    {
      schema: {
        params: $ref("deleteFeedbackParams"),
      },
    },
    deleteFeedbackHandler
  );
}

export default feedbackRouter;
