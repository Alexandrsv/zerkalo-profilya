import { FastifyInstance } from "fastify";

import { getRateLimitConfig } from "../../rate-limit/get-rate-limit-config";
import { $ref } from "../schemas/comment.schema";
import {
  createCommentHandler,
  deleteCommentHandler,
} from "../controllers/comment.controller";

async function commentsRouter(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createCommentBody"),
        response: {
          "2xx": $ref("commentSchema"),
        },
      },
      config: {
        rateLimit: getRateLimitConfig(4, 3 * 45 * 1000),
      },
    },
    createCommentHandler
  );
  server.delete(
    "/:id",
    {
      schema: {
        params: $ref("deleteCommentParams"),
        response: {
          "2xx": $ref("anonymousCommentSchema"),
        },
      },
    },
    deleteCommentHandler
  );
}

export default commentsRouter;
