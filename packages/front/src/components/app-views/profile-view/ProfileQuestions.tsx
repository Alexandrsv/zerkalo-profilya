import React, { FC } from "react";
import AddQuestion from "./AddQuestion";
import { QuestionsList } from "../../questions-list/QuestionsList";
import { Group } from "@vkontakte/vkui";
import { useModal } from "../../../hooks/use-modal";
import { EModals } from "../../../context/ModalContext";
import { IQuestion } from "../../../api/questions";

const ProfileQuestions: FC<{ questions?: IQuestion[] }> = ({ questions }) => {
  const { setModal } = useModal();
  const onClickAddQuestion = () => {
    setModal({ modalName: EModals.ADD_QUESTION });
  };
  return (
    <div>
      <Group mode={"card"}>
        <AddQuestion onClickAddQuestion={onClickAddQuestion} />
      </Group>
      <Group>
        <QuestionsList questions={questions} isOwner />
      </Group>
    </div>
  );
};

export default ProfileQuestions;
