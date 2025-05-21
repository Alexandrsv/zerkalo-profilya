import React, { FC } from "react";
import { SimpleCell, Text } from "@vkontakte/vkui";
import { Icon28UserBackgroundOutline } from "@vkontakte/icons";
import { EditUserBtn } from "./EditUserBtn";

export const AgeEditSimpleCell: FC<{
  onClickEdit: () => void;
  age: number;
}> = ({ age, onClickEdit }) => {
  return (
    <SimpleCell
      before={<Icon28UserBackgroundOutline />}
      subtitle={"Возраст"}
      after={<EditUserBtn onClickEdit={onClickEdit} />}
      className={"h-[65px]"}
    >
      {age ? (
        age
      ) : (
        <Text className={"text-txt-negative"}>Возраст не указан</Text>
      )}
    </SimpleCell>
  );
};
