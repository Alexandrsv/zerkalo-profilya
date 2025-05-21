import React, { FC, ReactNode } from "react";
import QuestionAuthorInfo from "./QuestionAuthorInfo";
import { Div } from "@vkontakte/vkui";
import { QuestionText } from "./QuestionText";
import { IQuestion } from "../../../api/questions";
import { useReportAbuse } from "../../../hooks/use-report-abuse";

const QuestionInfo: FC<{ question: IQuestion; children?: ReactNode }> = ({
  question,
  children,
}) => {
  const { showAbuseModal } = useReportAbuse();

  const onClickAbuse = () => {
    if (question) {
      showAbuseModal({ questionId: question?.id });
    }
  };
  return (
    <div>
      <div className={"flex flex-wrap "}>
        {question && <QuestionAuthorInfo question={question} />}
      </div>
      {children}
      <Div>
        <QuestionText
          questionText={question?.questionText}
          onClickAbuse={onClickAbuse}
        />
      </Div>
    </div>
  );
};

export default QuestionInfo;
