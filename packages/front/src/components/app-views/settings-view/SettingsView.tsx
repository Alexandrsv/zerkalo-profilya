import React, { FC } from "react";
import {
  Button,
  Group,
  Panel,
  PanelHeader,
  SimpleCell,
  View,
} from "@vkontakte/vkui";
import { PageNames } from "../../../routes";
import { panelNames } from "../../../const/panel-names";
import { useBridgeUser } from "../../../hooks/use-bridge-user";
import AddToProfileCell from "../../add-to-profile-cell/AddToProfileCell";
import Dev from "./Dev";
import HelpBtn from "../../help-btn/HelpBtn";
import NotificationCell from "../../notification-cell/NotificationCell";

const SettingsView: FC<{ id: PageNames }> = ({ id }) => {
  const { bridgeUser } = useBridgeUser();
  console.log({ bridgeUser });

  return (
    <View id={id} activePanel={id}>
      <Panel id={id}>
        <PanelHeader>{panelNames.settings}</PanelHeader>
        <Group className={"relative"}>
          <div className={"min-h-[300px]"}>
            <NotificationCell />
            <AddToProfileCell />
            <SimpleCell
              Component="label"
              disabled
              checked={false}
              after={
                <Button size={"s"} disabled>
                  В разработке
                </Button>
              }
            >
              <span className={"text-gray-400"}>Вернуть всё как было</span>
            </SimpleCell>
            {import.meta.env.MODE !== "production" && <Dev />}
          </div>
          <HelpBtn />
        </Group>
      </Panel>
    </View>
  );
};

export default SettingsView;
