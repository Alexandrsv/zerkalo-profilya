import React, { FC } from "react";
import { Alert, AlertActionInterface } from "@vkontakte/vkui";
import { ContentAlertProps } from "../../context/AlertContext";

type CustomAlertProps = {
  onClose: () => void;
  onAction?: () => void;
  content?: ContentAlertProps;
};

export const CustomAlert: FC<CustomAlertProps> = ({
  onClose,
  onAction,
  content,
}) => {
  const { header, text, actionText } = content || {};
  const [_isCancelAction, setIsCancelAction] = React.useState(false);

  const closeByCancel = () => {
    setIsCancelAction(false);
    onClose();
  };

  const actions: AlertActionInterface[] = [
    {
      title: "Отмена",
      mode: "cancel",
      action: closeByCancel,
    },
    {
      title: actionText || "Ок",
      mode: "destructive",
      action: () => {
        setIsCancelAction(true);
        if (onAction) onAction();
      },
    },
  ];

  return (
    <Alert
      actionsLayout="horizontal"
      title={header}
      onClose={onClose}
      actions={actions}
    >
      {text}
    </Alert>
  );
};
