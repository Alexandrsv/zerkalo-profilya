import React, { FC } from "react";
import { Div, Separator } from "@vkontakte/vkui";
import FeedbackActions from "./FeedbackActions";
import { UserInfoTag } from "../../user-info-tad/UserInfoTag";
import { sexNoun } from "../../../const/sex";
import { getDeclensionWord } from "../../../utils/get-declension-word";
import { IFeedback } from "../../../api/feedback";
import Comments from "./Comments";

const FeedbackItem: FC<{
  feedback: Omit<IFeedback, "authorId">;
  withoutSeparator?: boolean;
  questionId: string;
  questionText: string;
  isQuestionAuthor: boolean;
}> = ({
  questionId,
  feedback,
  withoutSeparator,
  isQuestionAuthor,
  questionText,
}) => {
  return (
    <div>
      <Div className={"flex flex-col"}>
        <div className={"flex text-sm"}>
          <span
            className={
              "text-txt-secondary inline-block self-center mt-1 mr-2 shrink-0"
            }
          >
            Автор:
          </span>
          <UserInfoTag
            text={feedback?.author.profession}
            className={"!text-txt-secondary !bg-transparent"}
          />
          <UserInfoTag
            text={sexNoun[feedback?.author.sex]}
            className={"!text-txt-secondary !bg-transparent shrink-0"}
          />
          {!!feedback?.author.age && (
            <UserInfoTag
              text={getDeclensionWord(
                ["год", "года", "лет"],
                feedback?.author.age
              )}
              className={"!text-txt-secondary !bg-transparent shrink-0"}
            />
          )}
        </div>
        <div
          className={
            "text-sm text-txt-secondary flex items-baseline justify-between"
          }
        >
          <div>Ответ:</div>
        </div>
        <p className={"whitespace-pre-line"}>{feedback.feedbackText}</p>
        <div className={"flex justify-end"}>
          <FeedbackActions
            questionText={questionText}
            feedbackText={feedback.feedbackText}
            questionId={questionId}
            feedbackId={feedback.id}
            isQuestionAuthor={isQuestionAuthor}
          />
        </div>
        <Comments
          lastComment={feedback.comments}
          feedbackId={feedback.id}
          questionId={questionId}
        />
      </Div>
      {!withoutSeparator && <Separator />}
    </div>
  );
};

export default FeedbackItem;
