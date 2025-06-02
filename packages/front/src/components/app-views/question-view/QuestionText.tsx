import React, { FC } from "react";
import { Div, useAdaptivity, ViewWidth } from "@vkontakte/vkui";
import AbuseBtn from "../../abuse-btn/AbuseBtn";

export const QuestionText: FC<{
  questionText?: string;
  onClickAbuse: () => void;
}> = ({ questionText, onClickAbuse }) => {
  const adaptivity = useAdaptivity();
  const isDesktop =
    adaptivity.viewWidth !== undefined &&
    adaptivity.viewWidth >= ViewWidth.SMALL_TABLET;
  
  if (!questionText) {
    return null;
  }

  return (
    <Div
      className={"border rounded-lg border-[#e5e7eb] border-1 flex flex-col "}
    >
      <div className={"flex items-center justify-between"}>
        <div className={`text-sm text-gray-400`}>Текст вопроса:</div>
        <AbuseBtn onCLick={onClickAbuse} />
      </div>
      <div
        className={`whitespace-pre-line ${
          isDesktop ? " max-w-[60vw]" : " max-w-[80vw]"
        } `}
      >
        {questionText}
      </div>
    </Div>
  );
};
