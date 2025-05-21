import React, { FC } from "react";
import {
  Button,
  Card,
  Div,
  Panel,
  PanelHeader,
  Text,
  Title,
  View,
} from "@vkontakte/vkui";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import OnboardingContentWrapper from "./OnboardingContentWrapper";
import PromoBlock11 from "./promo-blocks/PromoBlock11";
import PromoBlock12 from "./promo-blocks/PromoBlock12";
import PromoBlock13 from "./promo-blocks/PromoBlock13";
import PromoBlock14 from "./promo-blocks/PromoBlock14";
import PromoBlock15 from "./promo-blocks/PromoBlock15";

const Onboarding1: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const onContinue = () => {
    navigate(routes.onboarding_3);
  };
  return (
    <View id={id} activePanel={id} className={""}>
      <Panel id={id} className={""}>
        <PanelHeader>Добро пожаловать ❤️</PanelHeader>
        <OnboardingContentWrapper>
          <Title>Приложение "Расскажи обо мне"</Title>
          <div className={""}>
            <Card className={"items-center"}>
              <Text weight={"1"} className={"p-5"}>
                Узнайте, что люди думают о вашем профиле в социальных сетях!
              </Text>
            </Card>
          </div>
          <Div className={"flex flex-wrap justify-between grow !pt-5"}>
            <PromoBlock11 className={"text-purple-600 w-1/3"} />
            <PromoBlock12
              className={"text-purple-600 translate-y-1/4 rotate-12 w-1/3"}
            />
            <PromoBlock13 className={"text-purple-600  -rotate-12 w-1/3 "} />
            <PromoBlock14 className={"text-purple-600  -rotate-12 w-1/3 "} />
            <PromoBlock15 className={"text-purple-600  rotate-12 w-1/3 "} />
          </Div>
          <Button
            className={"self-center !px-6"}
            size={"l"}
            onClick={onContinue}
          >
            Ясно
          </Button>
        </OnboardingContentWrapper>
      </Panel>
    </View>
  );
};

export default Onboarding1;
