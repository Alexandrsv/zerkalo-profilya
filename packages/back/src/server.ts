import "./config/env"; // Загружаем переменные окружения в самом начале
import build from "./app";
import { FastifyServerOptions } from "fastify";

let options: FastifyServerOptions = {
  logger: {
    transport: {
      target: "pino-pretty",
    },
    level: "info",
  },
};

if (process.env.NODE_ENV === "production") {
  options = {
    logger: {
      transport: {
        target: "pino-pretty",
      },
      level: "warn",
    },
  };
}

const start = async () => {
  const server = await build();

  server.listen({ port: 3005, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      server.log.error(err, address);
      process.exit(1);
    }
  });
};

void start();
