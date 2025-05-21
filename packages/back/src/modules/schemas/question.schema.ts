import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { userSchema } from "./user.schema";
import { createFeedbackSchema, feedbackSchema } from "./feedback.schema";

export const questionSchema = z.object({
  id: z.string().uuid(),
  authorId: z.number(),
  questionText: z.string().min(5).max(500),
  targetUrl: z.string(),
  isActive: z.boolean(),
  author: userSchema,
  feedback: z.array(feedbackSchema.omit({ authorId: true })).optional(),
  feedbackCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const questionsSchema = z.array(
  questionSchema
    .merge(
      z.object({
        feedback: z
          .array(
            feedbackSchema.pick({
              id: true,
              viewed: true,
              createdAt: true,
              comments: true,
            })
          )
          .optional(),
      })
    )
    .merge(z.object({ isAnswered: z.boolean().optional() }))
);

const createQuestionSchema = questionSchema.pick({
  authorId: true,
  questionText: true,
  targetUrl: true,
  isActive: true,
});

const updateQuestionSchema = questionSchema
  .pick({
    questionText: true,
    targetUrl: true,
    isActive: true,
  })
  .partial();

const questionsQueryStringSchema = z.object({
  owner: z.boolean().optional(),
  authorVkId: z.string().regex(/^\d+$/).optional(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type QuestionsQueryString = z.infer<typeof questionsQueryStringSchema>;

export const { schemas: questionSchemas, $ref } = buildJsonSchemas(
  {
    createQuestionSchema,
    updateQuestionSchema,
    questionSchema,
    questionsSchema,
    questionsQueryStringSchema,
    feedbackSchema,
    createFeedbackSchema,
  },
  { $id: "questionSchemas" }
);
