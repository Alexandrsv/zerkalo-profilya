import { FastifyInstance } from "fastify";
import {
  addUserToHSHandler,
  getUserHandler,
  getUsersHandler,
  loginOrSignupHandler,
  patchUserHandler,
  setAppCounterHandler,
  syncDonStatusHandler,
} from "../controllers/user.controller";
import { $ref } from "../schemas/user.schema";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/login/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          "2xx": $ref("userSchema"),
        },
      },
    },
    loginOrSignupHandler
  );
  server.post(
    "/app-counter",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            value: { type: "number" },
          },
        },
        response: {
          "2xx": {
            type: "object",
            properties: {
              response: {
                type: "number",
              },
            },
          },
        },
      },
    },
    setAppCounterHandler
  );
  server.get(
    "/",
    {
      schema: {
        querystring: $ref("usersQueryStringSchema"),
        response: {
          "2xx": $ref("usersSchema"),
        },
      },
    },
    getUsersHandler
  );
  server.get(
    "/:id",
    {
      schema: {
        response: {
          "2xx": $ref("userSchema"),
        },
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
      },
    },
    getUserHandler
  );
  server.patch(
    "/:id",
    {
      schema: {
        body: $ref("patchUserSchema"),
        response: {
          "2xx": $ref("userSchema"),
        },
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
      },
    },
    patchUserHandler
  );
  server.post(
    "/:id/add-to-hs/",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
      },
    },
    addUserToHSHandler
  );
  server.post(
    "/:id/sync-don-status/",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
        response: {
          "2xx": {
            type: "object",
            properties: {
              success: { type: "boolean" },
              isDon: { type: "boolean" },
              message: { type: "string" },
            },
          },
          "4xx": {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    syncDonStatusHandler
  );
}

export default userRoutes;
