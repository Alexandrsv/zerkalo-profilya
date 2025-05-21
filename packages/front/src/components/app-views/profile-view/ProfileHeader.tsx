import React, { FC } from "react";
import {
  Avatar,
  Div,
  SizeType,
  Text,
  Title,
  useAdaptivity,
} from "@vkontakte/vkui";
import { IUser } from "../../../api/user";
import { useBridgeUser } from "../../../hooks/use-bridge-user";

const ProfileHeader: FC<{ appUser?: IUser }> = ({ appUser }) => {
  const { sizeX } = useAdaptivity();

  const profileHeaderMargin = sizeX === SizeType.REGULAR ? " -mx-2 -mt-2 " : "";
  const { bridgeUser } = useBridgeUser();
  return (
    <Div
      className={`flex flex-col items-center justify-center text-center !p-8 ${profileHeaderMargin}`}
    >
      <Avatar size={96} src={appUser?.photo} />
      <Title className={"!mb-2 !mt-5"} level="2" weight="2">
        {bridgeUser?.first_name + " " + bridgeUser?.last_name}
      </Title>
      <Text className={"!mb-6 text-txt-secondary"}>Пользователь</Text>
    </Div>
  );
};

export default ProfileHeader;
