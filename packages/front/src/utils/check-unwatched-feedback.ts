import { IQuestion } from "../api/questions";

export const checkUnwatchedFeedback = (questions?: IQuestion[]) => {
  if (!questions) return false;
  return questions?.some(
    (question) =>
      question.feedback?.filter((feedback) => feedback.viewed === false)
        .length > 0
  );
};
