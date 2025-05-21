import React, { FC, useState } from "react";
import { useBridgeUser } from "../../../hooks/use-bridge-user";
import {
  Button,
  ButtonGroup,
  Group,
  Panel,
  PanelHeader,
  Placeholder,
  View,
} from "@vkontakte/vkui";
import { panelNames } from "../../../const/panel-names";
import { PageNames } from "../../../routes";
import bridge from "@vkontakte/vk-bridge";
import { GROUP_ID } from "../../../const/group-id";

const AppleView: FC<{ id: PageNames }> = ({ id }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { bridgeUser } = useBridgeUser();

  const onClickJoin = async () => {
    const join = await bridge.send("VKWebAppJoinGroup", {
      group_id: GROUP_ID,
    });
    if (join.result) {
      setIsJoined(true);
    }
  };

  const onClickFavorite = async () => {
    const favorite = await bridge.send("VKWebAppAddToFavorites");
    if (favorite.result) {
      setIsFavorite(true);
    }
  };
  return (
    <View id={id} activePanel={id}>
      <Panel id={id}>
        <PanelHeader>{panelNames.settings}</PanelHeader>
        <Group>
          <Placeholder
            icon={
              <img
                src="/img/apple.png"
                alt="apple лого"
                height="100"
                width="100"
                className={
                  "drop-shadow-[0_0px_35px_rgba(0,0,200,0.35)] rotate-[20deg]"
                }
              />
            }
            header="Ой, у вас IOS!"
            action={
              <ButtonGroup mode="vertical" gap="m">
                {!isFavorite && (
                  <Button onClick={onClickFavorite} stretched>
                    Добавить в закладки
                  </Button>
                )}
                {isJoined ? (
                  <Button
                    onClick={() =>
                      window.open(`https://m.vk.com/club${GROUP_ID}`)
                    }
                    stretched
                  >
                    Перейти в группу
                  </Button>
                ) : (
                  <Button onClick={onClickJoin} stretched>
                    Следить за обновлениями
                  </Button>
                )}
              </ButtonGroup>
            }
          >
            {bridgeUser?.first_name ? bridgeUser?.first_name + ", " : ""}к
            сожалению, IOS не поддерживает корректное отображение приложения.
            Используйте десктопную версию.
            <br />
            Поддержка может появиться в будущем, следите за обновлениями.
          </Placeholder>
        </Group>
      </Panel>
    </View>
  );
};

export default AppleView;
