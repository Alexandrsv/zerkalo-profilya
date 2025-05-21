import { useContext } from "react";
import ModalContext, { EModals } from "../context/ModalContext";
import { useSearchParams } from "react-router-dom";

type EditQuestionMeta = {
  questionId: string;
};

type ReportAbuseMeta = {
  questionId: string;
  feedbackId?: string;
};

interface ISetModal {
  (params: { modalName: EModals.EDIT_QUESTION; meta: EditQuestionMeta }): void;
  (params: { modalName: EModals.REPORT_ABUSE; meta: ReportAbuseMeta }): void;
  (params: { modalName: EModals.ADD_QUESTION; meta?: never }): void;
  (params: { modalName: EModals.EDIT_USER; meta?: never }): void;
  (params: null): void;
}

export const useModal = () => {
  const { setActiveModal, activeModal } = useContext(ModalContext);
  let [searchParams, setSearchParams] = useSearchParams();

  const setModal: ISetModal = (args) => {
    if (args === null) {
      // Удалить meta параметры модалок из url и закрыть модалку
      searchParams.delete("modal");
      searchParams.delete("questionId");
      searchParams.delete("feedbackId");
      setSearchParams(searchParams);
      return;
    }
    const { modalName, meta } = args;

    if (modalName === EModals.REPORT_ABUSE) {
      searchParams.set("modal", modalName);
      searchParams.set("questionId", meta.questionId.toString());
      if (meta.feedbackId) {
        searchParams.set("feedbackId", meta.feedbackId.toString());
      }
      setSearchParams(searchParams);
      return;
    }

    if (modalName === EModals.EDIT_QUESTION) {
      if (!meta || meta.questionId) {
        throw new Error("Meta is required for editQuestion modal");
      }
      setSearchParams({
        ...searchParams,
        editQuestion: meta.questionId.toString(),
      });
      return;
    }

    // Для модалок, которым не нужна мета
    if (modalName) {
      setSearchParams({
        ...searchParams,
        modal: modalName,
      });
    }
    setActiveModal(modalName);
  };

  const getModalMeta = () => {
    if (!activeModal) return null;
    if (activeModal === EModals.REPORT_ABUSE) {
      return {
        questionId: searchParams.get("questionId") || "",
        feedbackId: searchParams.get("feedbackId") || "",
      };
    }
    return searchParams.get(activeModal);
  };

  return { setModal, activeModal, getModalMeta };
};
