import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { userSchema } from "./user.schema";

export const commentSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(5).max(2000),
  feedbackId: z.string().uuid(),
  questionId: z.string().uuid(),
  authorId: z.number(),
  author: userSchema
    .pick({ age: true, profession: true, sex: true })
    .optional(),
  parentId: z.string().uuid().optional(),
  canRemove: z.boolean().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const anonymousCommentSchema = commentSchema.omit({
  authorId: true,
});

export const commentsWithChildrenSchema = commentSchema.merge(
  z.object({ comments: commentSchema.array().optional() })
);

const createCommentBody = commentSchema.pick({
  text: true,
  feedbackId: true,
  questionId: true,
  authorId: true,
  parentId: true,
});

const deleteCommentParams = commentSchema.pick({
  id: true,
});

export type CreateCommentBody = z.infer<typeof createCommentBody>;
export type DeleteCommentParams = z.infer<typeof deleteCommentParams>;

export const { schemas: commentSchemas, $ref } = buildJsonSchemas(
  {
    commentSchema,
    deleteCommentParams,
    createCommentBody,
    anonymousCommentSchema,
  },
  { $id: "commentSchemas" }
);
