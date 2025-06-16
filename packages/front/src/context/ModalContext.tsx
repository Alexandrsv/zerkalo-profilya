import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";

export enum EModals {
  ADD_QUESTION = "add-question",
  EDIT_QUESTION = "edit-question",
  ADD_FEEDBACK = "add-feedback",
  REPORT_ABUSE = "report-abuse",
  EDIT_USER = "edit-user",
}

export type ModalName = `${EModals}` | null;

export interface IModalContextModel {
  activeModal: ModalName;
  setActiveModal: (activeModal: ModalName) => void;
}

const ModalCtx = createContext<IModalContextModel>({
  activeModal: null,
  setActiveModal: () => {},
});

export const ModalContextProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const [activeModal, setModal] = useState<ModalName>(null);
  const [searchParams] = useSearchParams();

  const setActiveModal = useCallback((modal: ModalName) => {
    setModal(modal);
  }, []);

  useEffect(() => {
    const modal = searchParams.get("modal");

    if (modal !== null) {
      setActiveModal(modal as ModalName);
    } else {
      setActiveModal(null);
    }
  }, [searchParams, setActiveModal]);

  return (
    <ModalCtx.Provider
      value={{
        activeModal,
        setActiveModal,
      }}
    >
      {props.children}
    </ModalCtx.Provider>
  );
};

export default ModalCtx;
