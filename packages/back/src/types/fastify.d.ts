import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyContextConfig {
    rateLimit?: {
      timeWindow: number | string;
      max: number | ((req: FastifyRequest) => number | Promise<number>);
    };
  }
}
