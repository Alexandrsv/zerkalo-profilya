import React, { FC } from "react";
import { IQuestion } from "../../api/questions";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../../hooks/use-questions";
import { getTargetUrlInfo } from "../../utils/get-target-url-info";
import ym from "react-yandex-metrika";
import { checkUnwatchedFeedback } from "../../utils/check-unwatched-feedback";
import { Avatar, Badge, IconButton, RichCell, Text } from "@vkontakte/vkui";
import {
  Icon20CheckBoxOn,
  Icon28DeleteOutlineAndroid,
  Icon28Play,
  Icon28RepostCircleFillGreen,
  Icon28StopCircleOutline,
} from "@vkontakte/icons";
import { getDeclensionWord } from "../../utils/get-declension-word";
import { bridgeWebAppShare } from "@/utils/bridge/bridge-web-app-share";

export const QuestionItem: FC<{
  question: IQuestion;
  isOwner?: boolean;
  isOtherProfile?: boolean;
  isAnswered?: boolean;
}> = ({ question, isOwner, isOtherProfile = false, isAnswered }) => {
  const navigate = useNavigate();
  const { removeQuestion } = useQuestions({ owner: true });
  const { logo } = getTargetUrlInfo(question.targetUrl);

  const deleteQuestion = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    void removeQuestion(question.id);
  };

  const onClickQuestion = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/question/${question.id}`);
  };

  const onClickRepost = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();
    let post;

    try {
      const url = `https://vk.com/app51465205${encodeURI(
        "#/question/" + question.id
      )}`;

      post = await bridgeWebAppShare(url);
    } catch (e) {
      console.log(e);
    }

    if (post) {
      ym("reachGoal", "wall-post-from-questions-list");
    }
  };

  const questionTextPrev =
    question.questionText.length > 100
      ? question.questionText.slice(0, 100) + "..."
      : question.questionText;
  const hasUnwatched = checkUnwatchedFeedback([question]);

  return (
    <RichCell
      onClick={onClickQuestion}
      before={
        isOtherProfile ? (
          <div
            className={
              "w-[50px] h-[50px] border rounded-full flex justify-center items-center text-4xl text-gray-500"
            }
          >
            ?
          </div>
        ) : (
          <Avatar size={60} src={question.author.photo} />
        )
      }
      actions={
        isOwner && (
          <div className={"flex items-center w-full"}>
            <IconButton onClick={onClickRepost}>
              <Icon28RepostCircleFillGreen height={28} width={28} />
            </IconButton>

            <Text weight={"2"} className={"text-blue-500 !ml-3"}>
              {getDeclensionWord(
                ["отзыв", "отзыва", "отзывов"],
                question.feedbackCount
              )}
            </Text>
            {hasUnwatched && (
              <Badge mode={"prominent"} className={"ml-1 animate-pulse"} />
            )}
            <div className={"grow flex"}>
              <div className={"ml-auto flex items-center"}>
                <IconButton onClick={deleteQuestion}>
                  <Icon28DeleteOutlineAndroid
                    fill={"gray"}
                    height={28}
                    width={28}
                  />
                </IconButton>
              </div>
            </div>
          </div>
        )
      }
      bottom={
        <span
          className={"block overflow-hidden text-ellipsis whitespace-nowrap "}
        >
          {questionTextPrev}
        </span>
      }
      after={
        <div className={"flex space-x-2 items-center"}>
          {isOwner &&
            (question.isActive ? (
              <Icon28Play fill={"#639f63aa"} />
            ) : (
              <Icon28StopCircleOutline fill={"grey"} />
            ))}
          {isAnswered && isOtherProfile ? (
            <Icon20CheckBoxOn
              title={"Вы уже ответили на этот вопрос"}
              fill={"green"}
              height={24}
              width={24}
            />
          ) : (
            <img className={"h-6"} src={logo} alt={"social logo"} />
          )}
        </div>
      }
    >
      {isOtherProfile ? (
        <div className={"text-l text-gray-500"}>Вопрос:</div>
      ) : (
        <div className={"text-lg text-gray-500"}>{question.author.name}</div>
      )}
    </RichCell>
  );
};
