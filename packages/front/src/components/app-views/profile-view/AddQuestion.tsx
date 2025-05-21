import React, { FC } from "react";
import { CellButton } from "@vkontakte/vkui";
import { Icon28AddOutline } from "@vkontakte/icons";

const AddQuestion: FC<{ onClickAddQuestion: () => void }> = ({
  onClickAddQuestion,
}) => {
  return (
    <CellButton before={<Icon28AddOutline />} onClick={onClickAddQuestion}>
      Добавить вопрос
    </CellButton>
  );
};

export default AddQuestion;
