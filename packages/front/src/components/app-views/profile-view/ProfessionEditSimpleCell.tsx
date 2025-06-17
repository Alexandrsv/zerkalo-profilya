import React, { FC } from "react";
import { SimpleCell, Text } from "@vkontakte/vkui";
import { Icon28UserBackgroundOutline } from "@vkontakte/icons";
import { EditUserBtn } from "./EditUserBtn";

export const ProfessionEditSimpleCell: FC<{
  profession?: string | null;
  onClickEdit: () => void;
}> = ({ profession = "", onClickEdit }) => {
  return (
    <SimpleCell
      before={<Icon28UserBackgroundOutline />}
      subtitle={"Профессия"}
      after={<EditUserBtn onClickEdit={onClickEdit} />}
      className={"h-[65px]"}
    >
      {profession ? (
        profession
      ) : (
        <Text className={"text-txt-negative"}>Профессия не указана</Text>
      )}
    </SimpleCell>
  );
};
