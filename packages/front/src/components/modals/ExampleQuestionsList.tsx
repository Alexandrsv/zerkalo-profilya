import React, { FC, useState } from "react";
import { Button, Div, IconButton, SimpleCell } from "@vkontakte/vkui";
import { questionsExample } from "../../const/questions-example";
import {
  Icon28ArrowLeftOutline,
  Icon28ArrowRightOutline,
} from "@vkontakte/icons";
import { chunk } from "../../utils/chunk";

const Item: FC<{ question: string; onClick: (question: string) => void }> = ({
  question,
  onClick,
}) => {
  return (
    <SimpleCell
      onClick={() => onClick(question)}
      className={"border border rounded-xl text-left !whitespace-normal"}
    >
      {question}
    </SimpleCell>
  );
};

const ExampleQuestionsList: FC<{
  onChoiceExample: (question: string) => void;
  onBack: () => void;
  variant?: "onboarding" | "modal";
}> = ({ onChoiceExample, onBack, variant: _variant }) => {
  const [page, setPage] = useState(0);

  const exampleQuestionsChunk = chunk(questionsExample, 4);

  const isPrevDisabled = page === 0;
  const isNextDisabled = page === exampleQuestionsChunk.length - 1;

  const onClickNext = () => {
    setPage(page + 1);
  };

  const onClickPrev = () => {
    setPage(page - 1);
  };

  return (
    <Div
      className={`absolute flex
         dark:bg-[#19191A] bg-content-bg
         flex-col items-start h-auto absolute rounded-xl bottom-0 left-0 right-0 z-40 space-y-2 top-3`}
    >
      {exampleQuestionsChunk[page].map((question, index) => (
        <Item key={index} question={question} onClick={onChoiceExample} />
      ))}
      <div className={"grow flex items-end w-full"}>
        <div className={"flex items-center w-full"}>
          <div className={"inline-flex w-full justify-center space-x-4"}>
            <IconButton onClick={onClickPrev} disabled={isPrevDisabled}>
              <Icon28ArrowLeftOutline
                fill={
                  isPrevDisabled
                    ? "var(--vkui--color_accent_gray)"
                    : "var(--vkui--color_accent_blue)"
                }
                height={40}
                width={40}
              />
            </IconButton>
            <IconButton onClick={onClickNext} disabled={isNextDisabled}>
              <Icon28ArrowRightOutline
                fill={
                  isNextDisabled
                    ? "var(--vkui--color_accent_gray)"
                    : "var(--vkui--color_accent_blue)"
                }
                height={40}
                width={40}
              />
            </IconButton>
          </div>
          <Button
            className={"justify-self-end"}
            appearance={"neutral"}
            onClick={onBack}
          >
            Назад
          </Button>
        </div>
      </div>
    </Div>
  );
};

export default ExampleQuestionsList;
