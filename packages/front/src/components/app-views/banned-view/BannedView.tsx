import React, { FC } from "react";
import { Group, Panel, PanelHeader, Placeholder, View } from "@vkontakte/vkui";
import { panelNames } from "../../../const/panel-names";
import { useAppUser } from "../../../hooks/use-app-user";
import { PageNames } from "../../../routes";

interface IUserWithBanned {
  banned: boolean;
  bannedReason?: string;
}

const BannedView: FC<{ id: PageNames }> = ({ id }) => {
  const { user } = useAppUser();

  return (
    <View id={id} activePanel={id}>
      <Panel id={id}>
        <PanelHeader>{panelNames.banned}</PanelHeader>
        <Group>
          <Placeholder
            icon={
              <img
                src="/img/banned.png"
                alt="banned logo"
                className="rounded-full"
                width="100px"
                height="100px"
              />
            }
            title={
              <div>
                <span className="text-red-500 font-bold">ВЫ ЗАБЛОКИРОВАНЫ</span>
              </div>
            }
          >
            {user?.bannedReason || "Заблокирован за нарушение правил сервиса"}
          </Placeholder>
        </Group>
      </Panel>
    </View>
  );
};

export default BannedView;
