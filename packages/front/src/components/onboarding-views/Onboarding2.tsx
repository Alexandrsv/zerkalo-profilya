import React, { FC } from "react";
import { Panel, PanelHeader, Text, Title, View } from "@vkontakte/vkui";
import { useNavigate } from "react-router-dom";
import { useAppUser } from "../../hooks/use-app-user";
import EditUserInfoForm from "../edit-user-info-form/EditUserInfoForm";
import { PatchUserInput } from "../../api/user";
import { routes } from "../../routes";
import OnboardingContentWrapper from "./OnboardingContentWrapper";

const Onboarding2: FC<{ id: string }> = ({ id }) => {
  const { user, updateUser } = useAppUser();
  const navigate = useNavigate();

  const onContinue = async (newUserInfo: PatchUserInput) => {
    const response = await updateUser(newUserInfo);

    if (response) {
      navigate(routes.onboarding_3);
    }
  };

  return (
    <View id={id} activePanel={id} className={""}>
      <Panel id={id} className={""}>
        <PanelHeader>Добро пожаловать ❤️</PanelHeader>
        <OnboardingContentWrapper>
          <Title>Познакомимся</Title>
          <div className={"grow flex flex-col"}>
            <Text>
              Укажите данные о себе, это поможет людям лучше вас понять
            </Text>
            <EditUserInfoForm
              user={user}
              buttonText={"Далее"}
              updateUser={onContinue}
            />
          </div>
        </OnboardingContentWrapper>
      </Panel>
    </View>
  );
};

export default Onboarding2;
