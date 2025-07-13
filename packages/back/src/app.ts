import { fastify, FastifyServerOptions } from "fastify";
import userRouter from "./modules/routers/user.router";
import questionRoutes from "./modules/routers/question.router";
import { userSchemas } from "./modules/schemas/user.schema";
import { questionSchemas } from "./modules/schemas/question.schema";
import cors from "@fastify/cors";
import { healthcheckHandler } from "./utils/healthcheck";
import { validationSignHandler } from "./validation-sign-handler";
import { IVkAppParams } from "./models/vk-app-params";
import abuseRouter from "./modules/routers/abuse.router";
import { abuseSchemas } from "./modules/schemas/abuse.schema";
import rateLimit from "@fastify/rate-limit";
import { mainRateLimitConfig } from "./rate-limit/main-config";
import { commentSchemas } from "./modules/schemas/comment.schema";
import { feedbackSchemas } from "./modules/schemas/feedback.schema";
import feedbackRouter from "./modules/routers/feedback.router";
import commentsRouter from "./modules/routers/comment.router";
import callbackRouter from "./modules/routers/callback.router";
import { callbackSchemas } from "./modules/schemas/callback.schema";
import { ENV } from "./config/env";

declare module "fastify" {
  export interface FastifyInstance {
    auth: any;
  }

  export interface FastifyRequest {
    user: IVkAppParams;
  }
}

async function build(opts?: FastifyServerOptions) {
  const app = fastify(opts);
  const SENTRY_DSN = ENV.SENTRY_DSN;

  if (SENTRY_DSN) {
    app.register(require("fastify-sentry"), {
      dsn: SENTRY_DSN,
      environment: "production",
    });
  }

  for (const schema of [
    ...userSchemas,
    ...questionSchemas,
    ...abuseSchemas,
    ...feedbackSchemas,
    ...commentSchemas,
    ...callbackSchemas,
  ]) {
    app.addSchema(schema);
  }

  app.register(cors, {
    origin: "*",
  });
  app.decorateRequest("user", null);
  app.addHook("preHandler", validationSignHandler);
  await app.register(rateLimit, mainRateLimitConfig);
  app.register(userRouter, { prefix: "/users" });
  app.register(questionRoutes, { prefix: "/questions" });
  app.register(abuseRouter, { prefix: "/abuse" });
  app.register(feedbackRouter, { prefix: "/feedback/" });
  app.register(commentsRouter, { prefix: "/comments/" });
  app.register(callbackRouter, { prefix: "/callback" });
  app.register(healthcheckHandler);

  return app;
}

export default build;
