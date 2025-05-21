import { Alert } from "@vkontakte/vkui";
import React, { FC } from "react";

export type CustomAlertProps = {
  onClose: VoidFunction;
  action: VoidFunction;
  actionText: string;
  header: string;
  text: string;
};

export const CustomAlert: FC<CustomAlertProps> = ({
  onClose,
  action,
  actionText,
  header,
  text,
}) => {
  return (
    <Alert
      actions={[
        {
          title: "Отмена",
          autoclose: true,
          mode: "cancel",
          action: onClose,
        },
        {
          title: actionText,
          autoclose: true,
          mode: "default",
          action: action,
        },
      ]}
      actionsLayout="horizontal"
      onClose={onClose}
      header={header}
      text={text}
    />
  );
};
