import React, { FC } from "react";
import { ModalCard, ModalPage, ModalRoot } from "@vkontakte/vkui";
import { useModal } from "../../hooks/use-modal";
import { useAppUser } from "../../hooks/use-app-user";
import ModalAddQuestionPage from "./ModalAddQuestionPage";
import { EModals } from "../../context/ModalContext";
import { ModalReportAbuse } from "./ModalReportAbuse";
import ModalEditUser from "./ModalEditUser";

export const Modals: FC = () => {
  const { activeModal, setModal } = useModal();

  const onClose = () => {
    setModal(null);
  };

  const { user, updateUser } = useAppUser();

  return (
    <ModalRoot activeModal={activeModal}>
      <ModalPage
        onClose={onClose}
        id={EModals.ADD_QUESTION}
        dynamicContentHeight
      >
        <ModalAddQuestionPage
          user={user}
          updateUser={updateUser}
          onClose={onClose}
        />
      </ModalPage>

      <ModalPage
        onClose={onClose}
        id={EModals.REPORT_ABUSE}
        dynamicContentHeight
      >
        <ModalReportAbuse
          onClose={onClose}
          questionId="report"
          id="report-abuse-modal"
        />
      </ModalPage>

      <ModalPage onClose={onClose} id={EModals.EDIT_USER} dynamicContentHeight>
        <ModalEditUser onClose={onClose} />
      </ModalPage>

      <ModalCard onClose={onClose} id="addQuestion2">
        asd
      </ModalCard>
    </ModalRoot>
  );
};
