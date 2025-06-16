import React, { FC, memo } from "react";
import { Div, Separator } from "@vkontakte/vkui";
import FeedbackActions from "./FeedbackActions";
import { UserInfoTag } from "../../user-info-tad/UserInfoTag";
import { sexNoun } from "@/const/sex";
import { getDeclensionWord } from "@/utils/get-declension-word";
import { IFeedback } from "@/api/feedback";
import { IUser } from "@/api/user";
import Comments from "./Comments";
import OpenFeedbackAuthor from "./OpenFeedbackAuthor";

interface Props {
  feedback: Omit<IFeedback, "authorId">;
  withoutSeparator?: boolean;
  questionId: string;
  questionText: string;
  isQuestionAuthor: boolean;
}

const FeedbackItem: FC<Props> = memo(
  ({
    questionId,
    feedback,
    withoutSeparator,
    isQuestionAuthor,
    questionText,
  }) => {
    // Type guard для проверки открытого feedback
    const isOpenFeedback = !feedback.isAnonymous && feedback.author;

    // Type guards для narrowing типов автора
    const hasOpenAuthor = (
      author: IFeedback["author"]
    ): author is Pick<IUser, "id" | "vkId" | "name" | "photo" | "isDon"> => {
      return !feedback.isAnonymous && !!author && "vkId" in author;
    };

    const hasAnonymousAuthor = (
      author: IFeedback["author"]
    ): author is Pick<IUser, "profession" | "age" | "sex"> => {
      return feedback.isAnonymous && !!author && "profession" in author;
    };

    return (
      <div>
        <Div className={"flex flex-col"}>
          {/* Для открытых ответов показываем полный профиль */}
          {isOpenFeedback && hasOpenAuthor(feedback.author) ? (
            <OpenFeedbackAuthor author={feedback.author} className={"mb-2"} />
          ) : (
            /* Для анонимных ответов показываем только базовую информацию */
            hasAnonymousAuthor(feedback.author) && (
              <div className={"flex text-sm"}>
                <span
                  className={
                    "text-txt-secondary inline-block self-center mt-1 mr-2 shrink-0"
                  }
                >
                  Автор:
                </span>
                <UserInfoTag
                  text={feedback.author.profession}
                  className={"!text-txt-secondary !bg-transparent"}
                />
                <UserInfoTag
                  text={sexNoun[feedback.author.sex]}
                  className={"!text-txt-secondary !bg-transparent shrink-0"}
                />
                {!!feedback.author.age && (
                  <UserInfoTag
                    text={getDeclensionWord(
                      ["год", "года", "лет"],
                      feedback.author.age
                    )}
                    className={"!text-txt-secondary !bg-transparent shrink-0"}
                  />
                )}
              </div>
            )
          )}
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
  }
);

export default FeedbackItem;
