import { FastifyInstance } from "fastify";

export async function healthcheckHandler(server: FastifyInstance) {
  server.get("/healthcheck", async (request, reply) => {
    console.log(request.user.vk_user_id);
    reply.code(200).send({ status: "ok" });
  });
}
