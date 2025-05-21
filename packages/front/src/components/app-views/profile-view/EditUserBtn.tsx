import React, { FC } from "react";
import { IconButton } from "@vkontakte/vkui";
import { Icon28EditOutline } from "@vkontakte/icons";

export const EditUserBtn: FC<{ onClickEdit: () => void }> = ({
  onClickEdit,
}) => {
  return (
    <IconButton>
      <Icon28EditOutline onClick={onClickEdit} />
    </IconButton>
  );
};
