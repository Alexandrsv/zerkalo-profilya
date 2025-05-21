import React, { createContext, ReactNode, useState } from "react";
import {
  CustomAlert,
  CustomAlertProps,
} from "../components/popouts/CustomAlert";

export type ContentAlertProps = Omit<CustomAlertProps, "onClose" | "action">;

export type SetActiveAlert = {
  (cb: null, content?: never): void;
  (cb: VoidFunction, content: ContentAlertProps): void;
};

export interface IAlertContextModel {
  activeAlert: ReactNode | null;
  setActiveAlert: SetActiveAlert;
}

const AlertCtx = createContext<IAlertContextModel>({
  activeAlert: null,
  setActiveAlert: () => {},
});

export const AlertContextProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const [activeAlert, setupActiveAlert] = useState<JSX.Element | null>(null);

  const setActiveAlert: SetActiveAlert = (cb, alertContent) => {
    if (cb && alertContent) {
      setupActiveAlert(
        <CustomAlert
          {...alertContent}
          action={cb}
          onClose={() => setActiveAlert(null)}
        />
      );
    } else {
      setupActiveAlert(null);
    }
  };

  return (
    <AlertCtx.Provider
      value={{
        activeAlert,
        setActiveAlert,
      }}
    >
      {props.children}
    </AlertCtx.Provider>
  );
};

export default AlertCtx;
