import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import {
  Button,
  Group,
  Panel,
  PanelHeader,
  Placeholder,
  View,
} from "@vkontakte/vkui";
import { panelNames } from "../../../const/panel-names";
import Alien from "../../alien/Alien";

const Page404: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();

  const goToFeed = () => {
    navigate(routes.feed);
  };

  return (
    <View id={id} activePanel={id}>
      <Panel id={id}>
        <PanelHeader>{panelNames["404"]}</PanelHeader>
        <Group>
          <Placeholder
            icon={
              <img
                src={"/img/dead-dog.png"}
                alt={"404 icon"}
                className={"rounded-full rotate-[20deg]"}
              />
            }
            title={
              <div className={""}>
                <Alien /> 404 <Alien />
              </div>
            }
            action={
              <Button size="m" onClick={goToFeed}>
                К ленте вопросов
              </Button>
            }
          >
            Страницы, которую вы открыли, не существует
          </Placeholder>
        </Group>
      </Panel>
    </View>
  );
};

export default Page404;
