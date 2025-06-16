import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { userSchema } from "./user.schema";
import {
  createFeedbackSchema,
  feedbackSchema,
  baseFeedbackSchema,
} from "./feedback.schema";

export const questionSchema = z.object({
  id: z.string().uuid(),
  authorId: z.number(),
  questionText: z.string().min(5).max(500),
  targetUrl: z.string(),
  targetSex: z.enum(["0", "1", "2"]).default("0"),
  isActive: z.boolean(),
  author: userSchema,
  feedback: z.array(feedbackSchema).optional(),
  feedbackCount: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const questionsSchema = z.array(
  questionSchema
    .merge(
      z.object({
        feedback: z
          .array(
            baseFeedbackSchema.pick({
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
  targetSex: true,
  isActive: true,
});

const updateQuestionSchema = questionSchema
  .pick({
    questionText: true,
    targetUrl: true,
    targetSex: true,
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
