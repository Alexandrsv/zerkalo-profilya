import { Question } from "@prisma/client";

export const getUniqueQuestionsByAuthor = (questions: Question[]) => {
  if (!questions) {
    return [];
  }
  let authorIds: Record<number, boolean> = {};
  return questions.filter((question) => {
    if (authorIds[question.authorId]) {
      return false;
    }
    authorIds[question.authorId] = true;
    return true;
  });
};
