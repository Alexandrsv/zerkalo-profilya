import { ADMIN_VK_IDS } from "../const/admin-vk-ids";
import { FastifyRequest } from "fastify";

export const getRateLimitConfig = (
  max: number,
  timeWindow: number | string
) => ({
  timeWindow,
  max: async (req: FastifyRequest) =>
    ADMIN_VK_IDS.includes(req.user.vk_user_id) ? 1000 : max,
});
