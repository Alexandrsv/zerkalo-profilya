import prisma from "../../utils/prisma";
import { getQuestionById } from "./question.service";
import { setAppCounter } from "../../api/vk-api";
import { sendNotification } from "./notification.service";
import { decrementUserBoost } from "./user.service";

export async function createFeedback(args: {
  questionId: string;
  authorId: number;
  feedbackText: string;
  questionAuthor?: string;
  isAnonymous?: boolean;
}) {
  const {
    questionId,
    authorId,
    feedbackText,
    questionAuthor,
    isAnonymous = true,
  } = args;
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new Error("Question not found");
  }
  const feedbackCount = await getFeedbackCount(questionId);
  const [feedback] = await prisma.$transaction([
    prisma.feedback.create({
      data: {
        feedbackText,
        viewed: false,
        isAnonymous,
        author: {
          connect: { id: authorId },
        },
        question: {
          connect: { id: questionId },
        },
      },
    }),
    prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        feedbackCount: feedbackCount + 1,
      },
    }),
  ]);

  if (feedback) {
    try {
      await Promise.all([
        await setAppCounter({
          user_id: question.author.vkId!,
          counter: 1,
          increment: 1,
        }),
        await decrementUserBoost(question.author.id!),
      ]);
    } catch (e) {
      console.log("error", e);
    }
  }

  if (
    questionAuthor &&
    question.author.flags.includes("IS_ALLOW_PUSH_NOTIFICATION")
  ) {
    console.log("\n send notification \n");
    const notificationResponse = await sendNotification({
      questionId,
      userId: +questionAuthor,
      feedbackId: feedback.id,
    });
    console.log(
      "notificationResponse",
      JSON.stringify(notificationResponse?.data, null, 2)
    );
    try {
      if (notificationResponse?.data?.response[0]?.error?.code === 1) {
        await prisma.user.update({
          where: {
            vkId: questionAuthor,
          },
          data: {
            flags: {
              set: [
                ...question.author.flags.filter(
                  (f) => f !== "IS_ALLOW_PUSH_NOTIFICATION"
                ),
                "IS_CANCEL_PUSH_NOTIFICATION",
              ],
            },
          },
        });
      }
    } catch (e) {
      console.log("error", e);
    }
    if (notificationResponse?.data.error) {
      console.log("\n notification error \n");
      console.log(notificationResponse.data.error);
      console.log("\n");
    }
  }
  return feedback;
}

//TODO: Нужно сделать возврат коментов опциональным getFeedbackById много где используется
export const getFeedbackById = async (
  feedbackId: string,
  withComments = false
) => {
  let include = {};
  if (withComments) {
    include = {
      include: {
        comments: {
          include: {
            author: {
              select: {
                sex: true,
                profession: true,
                age: true,
              },
            },
          },
        },
      },
    };
  }
  try {
    const feedback = await prisma.feedback.findUnique({
      where: {
        id: feedbackId,
      },
      ...include,
    });
    if (feedback?.isRemoved) {
      return null;
    }
    return feedback;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export async function deleteFeedbackById(feedbackId: string) {
  const feedback = await getFeedbackById(feedbackId);
  if (feedback && feedback.questionId) {
    const feedbackCount = await getFeedbackCount(feedback.questionId);
    const [removedFeedback] = await prisma.$transaction([
      prisma.feedback.update({
        data: {
          isRemoved: true,
        },
        where: {
          id: feedbackId,
        },
      }),
      prisma.question.update({
        where: {
          id: feedback.questionId,
        },
        data: {
          feedbackCount: feedbackCount - 1,
        },
      }),
    ]);
    return removedFeedback;
  } else {
    return null;
  }
}

const getFeedbackCount = async (questionId: string) => {
  return await prisma.feedback.count({
    where: {
      questionId,
      isRemoved: false,
    },
  });
};

export const setFeedbackViewedFlag = async (
  feedbacksIds: string[],
  viewed: boolean = true
) => {
  await prisma.feedback.updateMany({
    where: {
      id: {
        in: feedbacksIds,
      },
    },
    data: {
      viewed,
    },
  });
};
