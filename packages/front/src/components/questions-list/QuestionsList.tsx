import React, { FC } from "react";
import { Div, Separator, Text } from "@vkontakte/vkui";
import { IQuestion } from "../../api/questions";
import { QuestionItem } from "../questions-item/QuestionItem";

export const QuestionsList: FC<{
  questions?: IQuestion[];
  isOwner?: boolean;
  isOtherProfile?: boolean;
}> = ({ questions, isOwner, isOtherProfile }) => {
  return (
    <Div>
      <ul>
        {questions?.map((question, index) => (
          <li key={question.id}>
            <QuestionItem
              question={question}
              isOwner={isOwner}
              isOtherProfile={isOtherProfile}
              isAnswered={question.isAnswered}
            />
            {index !== questions.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
      {questions?.length === 0 && (
        <Text weight={"2"} className={"text-center"}>
          ⬆️ У вас пока нет вопросов. Добавьте новый! ⬆️
        </Text>
      )}
    </Div>
  );
};
