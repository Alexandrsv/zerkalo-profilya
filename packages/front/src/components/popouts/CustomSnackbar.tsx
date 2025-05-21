import React, { FC } from "react";
import { Avatar, Snackbar } from "@vkontakte/vkui";
import { Icon16Done, Icon16ErrorCircle } from "@vkontakte/icons";

export interface ICustomSnackbarProps {
  text: string;
  onClose: () => void;
  variant?: "success" | "error";
}

export const CustomSnackbar: FC<ICustomSnackbarProps> = ({
  text,
  onClose,
  variant = "success",
}) => {
  const [showSnackbar, setShowSnackbar] = React.useState(true);
  return (
    <>
      {showSnackbar && (
        <Snackbar
          onClose={() => {
            onClose();
            setShowSnackbar(false);
          }}
          before={
            <Avatar
              size={24}
              style={{ background: "var(--vkui--color_background_accent)" }}
            >
              {variant === "success" && (
                <Icon16Done fill="#fff" width={14} height={14} />
              )}
              {variant === "error" && (
                <Icon16ErrorCircle fill="#fff" width={14} height={14} />
              )}
            </Avatar>
          }
        >
          {text}
        </Snackbar>
      )}
    </>
  );
};

export default CustomSnackbar;
