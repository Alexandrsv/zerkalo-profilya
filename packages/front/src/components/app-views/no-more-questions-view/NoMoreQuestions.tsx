import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import {
  Button,
  Div,
  Group,
  Panel,
  PanelHeader,
  Text,
  View,
} from "@vkontakte/vkui";
import { panelNames } from "../../../const/panel-names";
import { useUser } from "../../../hooks/use-user";
import { useProfileBtnStore } from "../../../store/profileBtnStore";
import { useQuestions } from "../../../hooks/use-questions";
import Alien from "../../alien/Alien";
import NotificationCell from "../../notification-cell/NotificationCell";

const NoMoreQuestionsView: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();

  let [vk_profile_id, setIsProfileBtnActive] = useProfileBtnStore((state) => [
    state.vk_profile_id,
    state.setIsProfileBtnActive,
  ]);
  const { user: otherUser } = useUser(vk_profile_id);
  const { questions } = useQuestions({ authorVkId: vk_profile_id });

  useEffect(() => {
    setIsProfileBtnActive(false);
  }, [setIsProfileBtnActive]);

  let questionsCounter = {
    count: 0,
    answered: 0,
  };

  if (questions) {
    questionsCounter.count = questions.length;
    questionsCounter.answered = questions.filter((q) => q.isAnswered).length;
  }
  const isAllQuestionsAnswered =
    questionsCounter.count === questionsCounter.answered &&
    questionsCounter.count > 0;

  const goToOnboarding = () => {
    setIsProfileBtnActive(false);
    navigate(routes.onboarding_1);
  };
  return (
    <View id={id} activePanel={id}>
      <Panel id={id}>
        <PanelHeader>{panelNames["404"]}</PanelHeader>
        <Group>
          {isAllQuestionsAnswered ? (
            <Text weight={"2"} className={"text-center py-3"}>
              Вы ответили на все вопросы,
              <br /> которые задал {otherUser?.name}! 🎉
            </Text>
          ) : (
            <Text weight={"2"} className={"text-center py-3"}>
              <Alien /> Новых вопросов больше нет <Alien />
            </Text>
          )}
        </Group>
        <Group>
          <Text weight={"2"} className={"text-center py-3"}>
            Приложение может вас уведомить, когда {otherUser?.name || "кто-то"}{" "}
            ответит вам
          </Text>
          <NotificationCell />
        </Group>
        <Group>
          <Text weight={"2"} className={"text-center py-3"}>
            Вы тоже можете задать вопросы о своем профиле и получить ответы
          </Text>
          <Div>
            <Button size={"l"} onClick={goToOnboarding} stretched>
              Что это за приложение?
            </Button>
          </Div>
        </Group>
      </Panel>
    </View>
  );
};

export default NoMoreQuestionsView;
