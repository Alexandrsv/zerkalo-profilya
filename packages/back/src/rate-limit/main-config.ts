import { FastifyRequest } from "fastify";
import { RateLimitPluginOptions } from "@fastify/rate-limit";

export const mainRateLimitConfig: RateLimitPluginOptions = {
  global: false,
  hook: "preHandler",
  keyGenerator(req: FastifyRequest) {
    return req.user.vk_user_id;
  },
  cache: 30000,
  addHeadersOnExceeding: {
    "x-ratelimit-limit": false,
    "x-ratelimit-remaining": false,
    "x-ratelimit-reset": false,
  },
  addHeaders: {
    "x-ratelimit-limit": false,
    "x-ratelimit-remaining": false,
    "x-ratelimit-reset": false,
    "retry-after": false,
  },
};
