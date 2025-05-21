import { FastifyInstance } from "fastify";
import { callbackHandler } from "../controllers/callback.controller";
import { $ref } from "../schemas/callback.schema";

async function callbackRouter(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("callbackSchema"),
        response: {
          "2xx": $ref("callbackResponse"),
        },
      },
    },
    callbackHandler
  );
}

export default callbackRouter;
