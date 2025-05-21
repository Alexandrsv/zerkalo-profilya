import prisma from "../../utils/prisma";
import { CreateCommentBody } from "../schemas/comment.schema";
import { Comment } from "@prisma/client";

export const selectCommentById = async (id: string) => {
  try {
    return await prisma.comment.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    return null;
  }
};

export const insertComment = async (
  args: CreateCommentBody
): Promise<Comment> => {
  let parentConnection = {};
  if (args.parentId) {
    parentConnection = {
      comment: {
        connect: {
          id: args.parentId,
        },
      },
    };
  }
  return await prisma.comment.create({
    data: {
      text: args.text,
      feedback: {
        connect: {
          id: args.feedbackId,
        },
      },
      author: {
        connect: {
          id: args.authorId,
        },
      },
      question: {
        connect: {
          id: args.questionId,
        },
      },
      ...parentConnection,
    },
  });
};

export const deleteComment = async (id: string) => {
  return await prisma.comment.delete({
    where: {
      id,
    },
  });
};
