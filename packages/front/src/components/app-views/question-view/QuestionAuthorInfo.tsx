import React, { FC } from "react";
import {
  Avatar,
  Div,
  RichCell,
  useAdaptivity,
  ViewWidth,
} from "@vkontakte/vkui";
import { getDeclensionWord } from "../../../utils/get-declension-word";
import { IQuestion } from "../../../api/questions";
import { getTargetUrlInfo } from "../../../utils/get-target-url-info";
import { UserInfoTag } from "../../user-info-tad/UserInfoTag";

const QuestionAuthorInfo: FC<{ question: IQuestion }> = ({ question }) => {
  const adaptivity = useAdaptivity();
  const isDesktop =
    adaptivity.viewWidth !== undefined &&
    adaptivity.viewWidth >= ViewWidth.SMALL_TABLET;

  const { logo } = getTargetUrlInfo(question.targetUrl);

  return (
    <Div className={"flex basis-full"}>
      <RichCell
        className={"w-full"}
        disabled
        before={<Avatar size={50} src={question?.author.photo} />}
        subtitle={
          <div
            className={`grid grid-flow-col justify-start space-x-2     
            text-ellipsis overflow-hidden whitespace-nowrap`}
          >
            {!!question?.author.age && (
              <UserInfoTag
                text={getDeclensionWord(
                  ["год", "года", "лет"],
                  question?.author.age
                )}
              />
            )}
            <UserInfoTag text={question?.author.profession} />
          </div>
        }
        after={<img className={"w-6"} src={logo} alt="sn logo" />}
        afterCaption={
          isDesktop && (
            <a
              href={question?.targetUrl}
              className={`block pt-5 cursor-pointer`}
              target={"_blank"}
              rel="noreferrer noopener"
            >
              {question?.targetUrl}
            </a>
          )
        }
      >
        {question?.author.name}
        <div className="text-xs text-gray-500">Автор вопроса</div>
      </RichCell>
    </Div>
  );
};

export default QuestionAuthorInfo;
