import React, { FC, useState } from "react";
import {
  Button,
  ButtonGroup,
  Group,
  Panel,
  PanelHeader,
  Placeholder,
  View,
} from "@vkontakte/vkui";
import { panelNames } from "@/const/panel-names";
import { PageNames } from "@/routes";
import bridge from "@vkontakte/vk-bridge";
import { GROUP_ID } from "@/const/group-id";

const AppleView: FC<{ id: PageNames }> = ({ id }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
        <PanelHeader>{panelNames.apple}</PanelHeader>
        <Group>
          <Placeholder
            icon={
              <img
                src={"/img/apple.png"}
                alt={"apple icon"}
                className={"rounded-full"}
              />
            }
            title="Ой, у вас IOS!"
            action={
              <ButtonGroup mode="vertical" gap="m">
                <Button size="m" onClick={onClickJoin} disabled={isJoined}>
                  {isJoined ? "Вы подписаны на нашу группу" : "Наша группа ВК"}
                </Button>
                <Button
                  size="m"
                  mode="secondary"
                  onClick={onClickFavorite}
                  disabled={isFavorite}
                >
                  {isFavorite
                    ? "Вы добавили нас в избраное"
                    : "Приложение в избранное"}
                </Button>
              </ButtonGroup>
            }
          >
            Мобильные приложения для IOS проходят модерацию AppStore и нам нужно
            время для запуска приложения в AppStore.
            <br />
            <br />
            Пожалуйста, подпишитесь на нашу группу, чтобы быть в курсе новостей.
          </Placeholder>
        </Group>
      </Panel>
    </View>
  );
};

export default AppleView;
