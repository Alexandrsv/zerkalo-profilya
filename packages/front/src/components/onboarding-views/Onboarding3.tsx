import React, { FC } from "react";
import { Panel, PanelHeader, Text, Title, View } from "@vkontakte/vkui";
import { useNavigate } from "react-router-dom";
import ModalAddQuestionPage from "../modals/ModalAddQuestionPage";
import { useAppUser } from "@/hooks/use-app-user";
import { routes } from "@/routes";
import OnboardingContentWrapper from "./OnboardingContentWrapper";
import ym from "react-yandex-metrika";

const Onboarding3: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAppUser();

  const onContinue = () => {
    navigate(routes.onboarding_4);
  };

  const onSkip = () => {
    ym("reachGoal", "skip-question-creation-onboarding");
    navigate(routes.onboarding_4);
  };

  return (
    <View id={id} activePanel={id} className={""}>
      <Panel id={id} className={""}>
        <PanelHeader>Добро пожаловать ❤️</PanelHeader>

        <OnboardingContentWrapper>
          <Title>Создайте первый вопрос</Title>
          <div className={"py-4"}>
            <Text>
              Как случайные люди воспринимают ваш профиль? Вы можете это узнать.
              Просто задайте вопрос, воспользуйтесь примерами или придумайте
              свой.
            </Text>
          </div>
          <ModalAddQuestionPage
            onClose={onContinue}
            user={user}
            updateUser={updateUser}
            variant={"onboarding"}
            onSkip={onSkip}
          />
        </OnboardingContentWrapper>
      </Panel>
    </View>
  );
};

export default Onboarding3;
