import { FastifyInstance } from "fastify";
import { createAbuseReport } from "../controllers/abuse.controller";
import { $ref } from "../schemas/abuse.schema";
import { getRateLimitConfig } from "../../rate-limit/get-rate-limit-config";

async function abuseRouter(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createAbuseSchema"),
        response: {
          "2xx": $ref("abuseSchema"),
        },
      },
      config: {
        rateLimit: getRateLimitConfig(4, 3 * 45 * 1000),
      },
    },
    createAbuseReport
  );
}

export default abuseRouter;
