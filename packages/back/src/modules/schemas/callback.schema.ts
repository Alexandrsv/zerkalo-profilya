import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { VkAllEvents } from "../../models/vk-callback-events";

export const callbackSchema = z.object({
  type: z.string(),
  object: z.record(z.string(), z.any()).optional(),
  group_id: z.number().optional(),
  secret: z.string().optional(),
  v: z.string().optional(),
  event_id: z.string().optional(),
});

//TODO: Это не работает, надо разобраться почему
export const callbackResponse = z.literal("ok");

export type CallbackEvent = VkAllEvents;

export const { schemas: callbackSchemas, $ref } = buildJsonSchemas(
  {
    callbackSchema,
    callbackResponse,
  },
  { $id: "callbackSchemas" }
);
