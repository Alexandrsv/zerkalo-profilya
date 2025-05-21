import React, { FC } from "react";
import { Avatar, Div, Group, Title } from "@vkontakte/vkui";
import { IUser } from "../../../api/user";
import { useBridgeUser } from "../../../hooks/use-bridge-user";

const OtherProfileHeader: FC<{ otherUser?: IUser; appUser?: IUser }> = ({
  otherUser,
  appUser,
}) => {
  const appUserFirstName = appUser?.name?.split(" ")[0] || "Привет";

  const { bridgeUser: otherUserBridge } = useBridgeUser(otherUser?.vkId);

  return (
    <Group>
      <Div className={""}>
        <div className={"flex"}>
          <div className={""}>
            <Avatar size={96} src={otherUserBridge?.photo_200} />
          </div>

          <div>
            <div className={"mx-5 pb-2"}>
              <Title className={""} level="3" weight="2">
                {otherUserBridge?.first_name + " " + otherUserBridge?.last_name}
              </Title>
            </div>
            <div className={"ml-5 px-2 pt-1 pb-2 border rounded-xl"}>
              {appUserFirstName}, я прошу тебя <b>анонимно</b> ответить на мои
              вопросы
            </div>
          </div>
        </div>
      </Div>
    </Group>
  );
};

export default OtherProfileHeader;
