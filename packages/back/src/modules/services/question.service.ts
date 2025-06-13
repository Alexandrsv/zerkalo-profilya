import prisma from "../../utils/prisma";
import {
  CreateQuestionInput,
  UpdateQuestionInput,
} from "../schemas/question.schema";
import { getUserByVkId } from "./user.service";
import { Question, User } from "@prisma/client";
import { shuffle } from "../../utils/shuffle";
import { setAppCounter } from "../../api/vk-api";
import { setFeedbackViewedFlag } from "./feedback.service";
import { getUniqueQuestionsByAuthor } from "../../utils/get-unique-questions-by-author";

export async function getNewQuestions4Feed(
  userId: number,
  count: number,
  excludedAuthorIds: number[] = [],
  userSex?: string
) {
  // Создаем условие для фильтрации по полу
  const sexFilter = userSex
    ? {
        OR: [
          { targetSex: "0" }, // вопросы для любого пола
          { targetSex: userSex }, // вопросы для конкретного пола пользователя
        ],
      }
    : {};

  return prisma.question.findMany({
    where: {
      isActive: true,
      authorId: {
        not: { in: [userId, ...excludedAuthorIds] },
      },
      author: {
        banned: null,
      },
      NOT: {
        feedback: {
          some: {
            authorId: userId,
            isRemoved: false,
          },
        },
      },
      ...sexFilter,
    },
    distinct: ["authorId"],
    orderBy: [
      {
        author: {
          isClosedProfile: "asc",
        },
      },
      { createdAt: "desc" },
    ],
    include: {
      author: true,
    },
    take: count,
  });
}

export async function getAuthorGuaranteedQuestions(
  authorId: number,
  userSex?: string
) {
  // Создаем условие для фильтрации по полу
  const sexCondition = userSex
    ? `and (q."targetSex" = '0' or q."targetSex" = '${userSex}')`
    : "";

  return (
    prisma.$queryRawUnsafe<Question[]>(
      `
      select
        rfb_sub.feedbackAuthors as feedbackAuthors,
        qu."name",
        qu.banned as banned,
        fu_count.wf_count,
        case
          when rfb_sub.rf_count is null then 0
          else rfb_sub.rf_count
        end as rf_count,
        q.id ,
        q."authorId" ,
        q."questionText" ,
        q."targetUrl" ,
        q."targetSex" ,
        q."isActive" ,
        q."feedbackCount",
        q."createdAt" ,
        q."updatedAt"
      from
          "Question" q
      join (
        select
          f_sub."authorId",
          count(id) as wf_count
        from
          "Feedback" f_sub
        group by
          f_sub."authorId") fu_count on
        q."authorId" = fu_count."authorId"
      left join (
          select
            count(sub_u."id") as rf_count,
            (array_agg(sub_u."id"))[1] as recipientId,
            array_agg(uqf."authorId") as feedbackAuthors
          from
              "User" sub_u
          join "Question" uq on
              uq."authorId" = sub_u."id"
          join "Feedback" uqf on
              uqf."questionId" = uq.id
          group by
              sub_u."id"
          ) as rfb_sub on
          rfb_sub.recipientId = q."authorId"
      join "User" as qu on
          qu.id = q."authorId"
      where
        q."isActive" = true
        and fu_count.wf_count > case
          when rfb_sub.rf_count is null then 99
          else rfb_sub.rf_count * 5
          end
        and banned is null
        and (q."authorId" != $1)
	      and (feedbackAuthors isnull or $1 != any(feedbackAuthors))
        ${sexCondition}
      order by
        wf_count desc
      limit 10`,
      authorId
    ) || []
  );
}

const getQuestionsWithNotify = async (userId: number, userSex?: string) => {
  // Создаем условие для фильтрации по полу
  const sexCondition = userSex
    ? `and (q."targetSex" = '0' or q."targetSex" = '${userSex}')`
    : "";

  return (
    prisma.$queryRawUnsafe<Question[]>(
      `
      select
          rfb_sub.feedbackAuthors as feedbackAuthors,
          'IS_ALLOW_PUSH_NOTIFICATION' = any(qu.flags) as push,
          'IS_ADD_TO_FAVOURITE' = any(qu.flags) as favourite,
          qu."name",
          fu_count.wf_count,
          qu.banned as banned,
          qu."isClosedProfile" as isClosed,
          case
              when rfb_sub.rf_count is null then 0
              else rfb_sub.rf_count
          end as rf_count,
          q.id ,
          q."authorId" ,
          q."questionText" ,
          q."targetUrl" ,
          q."targetSex" ,
          q."isActive" ,
          q."feedbackCount",
          q."createdAt" ,
          q."updatedAt"
      from
          "Question" q
      left outer join (
          select
              f_sub."authorId",
              count(id) as wf_count
          from
              "Feedback" f_sub
          group by
              f_sub."authorId") fu_count on
          q."authorId" = fu_count."authorId"
      left outer join (
          select
              count(sub_u."id") as rf_count,
              (array_agg(sub_u."id"))[1] as recipientId,
              array_agg(uqf."authorId") as feedbackAuthors
          from
              "User" sub_u
          join "Question" uq on
              uq."authorId" = sub_u."id"
          join "Feedback" uqf on
              uqf."questionId" = uq.id
          group by
              sub_u."id"
          ) as rfb_sub on
          rfb_sub.recipientId = q."authorId"
      join "User" as qu on
          qu.id = q."authorId"
      where
          q."isActive" = true
          and banned is null
          and (flags @> array['IS_ALLOW_PUSH_NOTIFICATION'::"UserFlag"] or flags @> array['IS_ADD_TO_FAVOURITE'::"UserFlag"] )
          and (q."authorId" != $1)
	        and (feedbackAuthors isnull or ($1 = ANY(feedbackAuthors) = false))
          ${sexCondition}
      order by
          isClosed asc,
          rf_count asc,
          wf_count desc NULLS LAST,
          q."createdAt" desc
      limit 40
	`,
      userId
    ) || []
  );
};

const getBoostedQuestions = async (userId: number, userSex?: string) => {
  // Создаем условие для фильтрации по полу
  const sexCondition = userSex
    ? `and (q."targetSex" = '0' or q."targetSex" = '${userSex}')`
    : "";

  return (
    prisma.$queryRawUnsafe<Question[]>(
      `
    select
      q."id" ,
      q."authorId" ,
      q."questionText" ,
      q."targetUrl" ,
      q."targetSex" ,
      q."isActive" ,
      q."feedbackCount",
      q."createdAt" ,
      q."updatedAt"
    from
      "Question" q
    join "User" u on
      u.id = q."authorId"
    where
      u.boost > 0
      and u.banned isnull
      and q."isActive"  
      and (q."authorId" != $1)
      and not exists (
        select 1 from "Feedback" f
        where f."questionId" = q."id"
        and f."authorId" = $1
      )
      ${sexCondition}
    limit 20
	`,
      userId
    ) || []
  );
};

export async function getQuestionsFeed(vkUserId: string) {
  const user = await getUserByVkId(vkUserId);
  const userSex = user?.sex; // Получаем пол пользователя

  let questions: Question[];

  questions = getUniqueQuestionsByAuthor(
    await getBoostedQuestions(user?.id || 0, userSex)
  );

  if (questions.length < 20) {
    questions = getUniqueQuestionsByAuthor(
      questions.concat(
        await getAuthorGuaranteedQuestions(user?.id || 0, userSex)
      )
    );
  }

  if (questions.length < 20) {
    questions = getUniqueQuestionsByAuthor(
      questions.concat(
        await getAuthorGuaranteedQuestions(user?.id || 0, userSex)
      )
    );
  }

  if (questions.length < 20) {
    questions = getUniqueQuestionsByAuthor(
      questions.concat(await getQuestionsWithNotify(user?.id || 0, userSex))
    ).slice(0, 20);
  }

  let shuffledQuestions = shuffle(questions);

  let questionsWithUser: Array<Question & { author: User }> = [];
  const authorIds = shuffledQuestions.map((q: Question) => q.authorId);
  const authors = await prisma.user.findMany({
    where: {
      id: {
        in: authorIds,
      },
    },
  });

  for (let i = 0; i < shuffledQuestions.length; i++) {
    questionsWithUser.push({
      ...shuffledQuestions[i],
      author: authors.find((a: any) => a.id === shuffledQuestions[i].authorId)!,
    });
  }

  const excludedAuthorIds = questionsWithUser.map((q) => q.authorId);

  if (questionsWithUser.length < 20) {
    const newQuestions = await getNewQuestions4Feed(
      user?.id || 0,
      20 - questionsWithUser.length,
      excludedAuthorIds,
      userSex
    );
    questionsWithUser = [...questionsWithUser, ...newQuestions];
  }

  return questionsWithUser;
}

export async function getQuestionById(questionId: string) {
  return prisma.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      author: true,
      feedback: {
        include: {
          author: true,
          comments: {
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          isRemoved: false,
        },
      },
    },
  });
}

export async function getAnsweredQuestionsByAuthor(
  questionAuthorId: number,
  answerAuthorId: number
) {
  return prisma.question.findMany({
    where: {
      authorId: questionAuthorId,
      isActive: true,
      feedbackCount: {
        gt: 0,
      },
      feedback: {
        some: {
          authorId: answerAuthorId,
        },
      },
    },
    include: {
      feedback: {
        select: {
          id: true,
          authorId: true,
        },
      },
    },
  });
}

export async function getQuestionsByAuthor(author: number, isActive?: boolean) {
  const isActiveQuestions = { isActive };

  return prisma.question.findMany({
    where: {
      authorId: author,
      ...isActiveQuestions,
    },
    include: {
      author: true,
      feedback: {
        select: {
          id: true,
          viewed: true,
          createdAt: true,
          comments: {
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getQuestionsByAuthorVKID(
  vkID: string,
  answersAuthorVKID: string,
  isActive?: boolean
) {
  const author = await getUserByVkId(vkID);
  const answersAuthor = await getUserByVkId(answersAuthorVKID);
  if (author && answersAuthor) {
    const allQuestions: (Question & {
      isAnswered?: boolean;
      feedback: {
        id: string;
        createdAt: Date;
        viewed: boolean;
      }[];
      author: User;
    })[] = await getQuestionsByAuthor(author.id, isActive);
    const answeredQuestions = await getAnsweredQuestionsByAuthor(
      author.id,
      answersAuthor.id
    );
    return allQuestions.map((q) => {
      q.isAnswered = answeredQuestions.some((qq) => qq.id === q.id);
      return q;
    });
  } else {
    return null;
  }
}

export async function createQuestion(createQuestionInput: CreateQuestionInput) {
  const { authorId, ...params } = createQuestionInput;
  return prisma.question.create({
    include: {
      author: true,
    },
    data: {
      ...params,
      author: {
        connect: { id: authorId },
      },
    },
  });
}

export async function updateQuestion(
  questionId: string,
  updateQuestionInput: UpdateQuestionInput
) {
  return prisma.question.update({
    where: {
      id: questionId,
    },
    data: updateQuestionInput,
    include: {
      author: true,
    },
  });
}

export async function deleteQuestionById(questionId: string) {
  try {
    return await prisma.question.delete({
      where: {
        id: questionId,
      },
    });
  } catch (error) {
    console.log({ error });
    throw new Error("internal server error");
  }
}

const selectQuestionsWithUnwatchedFeedbacks = async (authorId: number) => {
  return prisma.question.findMany({
    include: {
      feedback: {
        select: {
          id: true,
          viewed: true,
          isRemoved: true,
        },
      },
    },
    where: {
      authorId: authorId,
      feedbackCount: {
        gt: 0,
      },
      feedback: {
        some: {
          viewed: false,
        },
      },
    },
  });
};

export const getUnwatchedFeedbacks = (
  question: Question & {
    feedback: { id: string; isRemoved: boolean; viewed: boolean }[];
  }
) => {
  return question.feedback
    .flatMap((f) => (!f.viewed && !f.isRemoved && f.id) || undefined)
    .filter(Boolean) as string[];
};

export const updateAppCounterHandler = async (params: {
  questionId: string;
  authorId: number;
  vkId: string | number;
}) => {
  const questions = await selectQuestionsWithUnwatchedFeedbacks(
    params.authorId
  );

  const watchedQuestion = questions.find((q) => q.id === params.questionId);

  if (!watchedQuestion) {
    return; // у открытого вопроса нет новых фидбеков
  }

  if (questions.length !== 0) {
    const watchedFeedbacksIds = getUnwatchedFeedbacks(watchedQuestion);
    const watchedFeedbacksCount = watchedFeedbacksIds.length;

    if (questions.length === 1) {
      if (watchedFeedbacksIds.length !== 0) {
        await setFeedbackViewedFlag(watchedFeedbacksIds);
        await setAppCounter({
          user_id: params.vkId,
          counter: 0,
          increment: 0,
        });
      }
    }

    if (questions.length > 1) {
      const allUnwatchedFeedbacksIds = questions
        .flatMap((q) => getUnwatchedFeedbacks(q))
        .filter(Boolean) as string[];

      const allUnwatchedFeedbacksCount = allUnwatchedFeedbacksIds.length;
      const newUnwatchedFeedbacksCount =
        allUnwatchedFeedbacksCount - watchedFeedbacksCount;

      await setAppCounter({
        user_id: params.vkId,
        counter: newUnwatchedFeedbacksCount,
        increment: 0,
      });
      await setFeedbackViewedFlag(watchedFeedbacksIds);
    }
  }
};
