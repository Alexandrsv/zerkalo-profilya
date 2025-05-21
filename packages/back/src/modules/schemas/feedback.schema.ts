import { z } from "zod";
import { userSchema } from "./user.schema";
import { commentSchema } from "./comment.schema";
import { buildJsonSchemas } from "fastify-zod";

export const feedbackSchema = z.object({
  id: z.string().uuid(),
  authorId: z.number(),
  author: userSchema
    .pick({ age: true, profession: true, sex: true })
    .optional(),
  questionId: z.string().uuid(),
  feedbackText: z.string().min(30).max(3000),
  comments: commentSchema.omit({ authorId: true }).array().optional(),
  viewed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const anonymousFeedbackSchema = feedbackSchema.omit({
  authorId: true,
});

export const createFeedbackSchema = feedbackSchema.pick({
  authorId: true,
  feedbackText: true,
  questionId: true,
});

export const feedbackParamsSchema = feedbackSchema.pick({
  id: true,
});

export const deleteFeedbackParams = feedbackParamsSchema;

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type DeleteFeedbackParams = z.infer<typeof deleteFeedbackParams>;
export type FeedbackParams = z.infer<typeof feedbackParamsSchema>;

export const { schemas: feedbackSchemas, $ref } = buildJsonSchemas(
  {
    feedbackSchema,
    createFeedbackSchema,
    deleteFeedbackParams,
    feedbackParamsSchema,
    anonymousFeedbackSchema,
  },
  { $id: "feedbackSchemas" }
);
