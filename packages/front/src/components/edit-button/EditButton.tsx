import React, { FC } from "react";
import { Button, Text } from "@vkontakte/vkui";
import { Icon28EditOutline } from "@vkontakte/icons";

export const EditButton: FC<{
  isEdit: boolean;
  onClick: (status: boolean) => void;
}> = ({ isEdit, onClick }) => {
  return (
    <Button size={"s"} mode={"tertiary"}>
      {isEdit ? (
        // <Icon28CheckCircleOutline
        //   fill="var(--button_commerce_background,var(--vkui--color_background_positive))"
        //   onClick={() => onClick(!isEdit)}
        // />
        <Text className={"animate-pulse"} onClick={() => onClick(!isEdit)}>
          Сохранить
        </Text>
      ) : (
        <Icon28EditOutline onClick={() => onClick(!isEdit)} />
      )}
    </Button>
  );
};
