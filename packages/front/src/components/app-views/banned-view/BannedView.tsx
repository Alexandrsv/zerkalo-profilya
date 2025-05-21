import React, { FC } from "react";
import { Group, Panel, PanelHeader, Placeholder, View } from "@vkontakte/vkui";
import { panelNames } from "../../../const/panel-names";
import { useAppUser } from "../../../hooks/use-app-user";

const BannedView: FC<{ id: string }> = ({ id }) => {
  const { user } = useAppUser();
  return (
    <View id={id} activePanel={id}>
      <Panel id={id}>
        <PanelHeader>{panelNames.banned}</PanelHeader>
        <Group>
          <Placeholder
            icon={
              <img
                src={"/img/dead-dog.png"}
                alt={"dead dog"}
                className={"rounded-full -rotate-[20deg]"}
              />
            }
            header={
              <div className={"animate-hue-rotate"}>
                👽 Ваш профиль забанен 👽
              </div>
            }
          >
            причина: <br />
            {user?.banned}
          </Placeholder>
        </Group>
      </Panel>
    </View>
  );
};

export default BannedView;
