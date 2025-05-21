import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

export const abuseSchema = z.object({
  id: z.string().uuid(),
  text: z.string().max(5000),
  feedbackId: z.string().uuid().optional(),
  questionId: z.string().uuid().optional(),
  authorId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const createAbuseSchema = abuseSchema.pick({
  text: true,
  feedbackId: true,
  questionId: true,
  authorId: true,
});

export type CreateAbuseInput = z.infer<typeof createAbuseSchema>;

export const { schemas: abuseSchemas, $ref } = buildJsonSchemas(
  {
    abuseSchema,
    createAbuseSchema,
  },
  { $id: "abuseSchemas" }
);
