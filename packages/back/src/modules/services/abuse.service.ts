import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import { CreateAbuseInput } from "../schemas/abuse.schema";

export async function createAbuse({
  questionId,
  feedbackId,
  authorId,
  text,
}: CreateAbuseInput) {
  let data: Prisma.AbuseCreateArgs["data"] = {
    text,
    author: {
      connect: {
        id: authorId,
      },
    },
  };
  if (questionId) {
    data.question = {
      connect: {
        id: questionId,
      },
    };
  }
  if (feedbackId) {
    data.feedback = {
      connect: {
        id: feedbackId,
      },
    };
  }

  return await prisma.abuse.create({
    data,
  });
}
