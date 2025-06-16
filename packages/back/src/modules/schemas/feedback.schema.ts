import { z } from "zod";
import { userSchema } from "./user.schema";
import { commentSchema } from "./comment.schema";
import { buildJsonSchemas } from "fastify-zod";

// Базовая схема feedback без author
export const baseFeedbackSchema = z.object({
  id: z.string().uuid(),
  authorId: z.number(),
  questionId: z.string().uuid(),
  feedbackText: z.string().min(30).max(3000),
  comments: commentSchema.omit({ authorId: true }).array().optional(),
  viewed: z.boolean(),
  isAnonymous: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Схема для анонимного feedback
export const anonymousFeedbackSchema = baseFeedbackSchema.extend({
  isAnonymous: z.literal(true),
  author: userSchema
    .pick({ age: true, profession: true, sex: true })
    .optional(),
});

// Схема для открытого feedback
export const openFeedbackSchema = baseFeedbackSchema.extend({
  isAnonymous: z.literal(false),
  author: userSchema
    .pick({ id: true, vkId: true, name: true, photo: true, isDon: true })
    .optional(),
});

// Union схема для feedback
export const feedbackSchema = z.discriminatedUnion("isAnonymous", [
  anonymousFeedbackSchema,
  openFeedbackSchema,
]);

export const createFeedbackSchema = z.object({
  authorId: z.number(),
  feedbackText: z.string().min(30).max(3000),
  questionId: z.string().uuid(),
  isAnonymous: z.boolean().default(true),
});

export const feedbackParamsSchema = z.object({
  id: z.string().uuid(),
});

export const deleteFeedbackParams = feedbackParamsSchema;

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type DeleteFeedbackParams = z.infer<typeof deleteFeedbackParams>;
export type FeedbackParams = z.infer<typeof feedbackParamsSchema>;
export type IFeedback = z.infer<typeof feedbackSchema>;
export type AnonymousFeedback = z.infer<typeof anonymousFeedbackSchema>;
export type OpenFeedback = z.infer<typeof openFeedbackSchema>;

export const { schemas: feedbackSchemas, $ref } = buildJsonSchemas(
  {
    feedbackSchema,
    anonymousFeedbackSchema,
    openFeedbackSchema,
    createFeedbackSchema,
    deleteFeedbackParams,
    feedbackParamsSchema,
  },
  { $id: "feedbackSchemas" }
);
