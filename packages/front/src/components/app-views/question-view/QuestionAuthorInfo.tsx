import React, { FC } from "react";
import { Avatar, Div, RichCell, useAdaptivity } from "@vkontakte/vkui";
import { getDeclensionWord } from "../../../utils/get-declension-word";
import { IQuestion } from "../../../api/questions";
import { getTargetUrlInfo } from "../../../utils/get-target-url-info";
import { UserInfoTag } from "../../user-info-tad/UserInfoTag";

const QuestionAuthorInfo: FC<{ question: IQuestion }> = ({ question }) => {
  const adaptivity = useAdaptivity();
  const isDesktop = adaptivity.viewWidth > 2;

  const { logo } = getTargetUrlInfo(question.targetUrl);

  return (
    <Div className={"flex basis-full"}>
      <RichCell
        className={"w-full"}
        subhead={"Автор вопроса"}
        caption={
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
        before={<Avatar size={50} src={question?.author.photo} />}
        disabled
      >
        {question?.author.name}
      </RichCell>
    </Div>
  );
};

export default QuestionAuthorInfo;
