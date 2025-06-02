import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { CustomAlert } from "../components/popouts/CustomAlert";

export interface ContentAlertProps {
  header?: string;
  text?: string;
  actionText?: string;
}

export interface AlertContextValue {
  activeAlert: ReactNode;
  setActiveAlert: (cb: VoidFunction, content?: ContentAlertProps) => void;
  closeActiveAlert: () => void;
}

const AlertContext = createContext<AlertContextValue>({
  activeAlert: null,
  setActiveAlert: () => {},
  closeActiveAlert: () => {},
});

export const AlertContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [activeAlert, setActiveAlert] = useState<ReactNode>(null);

  const closeActiveAlert = useCallback(() => {
    setActiveAlert(null);
  }, []);

  const handleSetActiveAlert = useCallback(
    (cb: VoidFunction, content?: ContentAlertProps) => {
      setActiveAlert(
        <CustomAlert
          onAction={cb}
          onClose={closeActiveAlert}
          content={content}
        />
      );
    },
    [closeActiveAlert]
  );

  return (
    <AlertContext.Provider
      value={{
        activeAlert,
        setActiveAlert: handleSetActiveAlert,
        closeActiveAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
