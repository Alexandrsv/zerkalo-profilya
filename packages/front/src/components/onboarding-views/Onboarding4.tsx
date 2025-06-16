import React, { FC } from "react";
import {
  Button,
  Card,
  CardGrid,
  Panel,
  PanelHeader,
  Title,
  View,
  Text,
  ButtonGroup,
} from "@vkontakte/vkui";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import OnboardingContentWrapper from "./OnboardingContentWrapper";
import { useAppUser } from "../../hooks/use-app-user";
import PromoBlock41 from "./promo-blocks/PromoBlock41";
import { useQuestions } from "../../hooks/use-questions";

const Onboarding4: FC<{ id: string }> = ({ id }) => {
  const { updateUser, user } = useAppUser();
  const { questions: userQuestions } = useQuestions({ owner: true });
  const { questions: feedQuestions } = useQuestions({ owner: false });

  const navigate = useNavigate();

  const onGo = async () => {
    if (user) {
      await updateUser({ flags: [...user.flags, "IS_ONBOARDED"] });

      if (feedQuestions && feedQuestions.length > 0) {
        const questionId = feedQuestions[0].id;
        navigate(routes.question.replace(":questionId", questionId));

        return;
      } else {
        navigate(routes.feed);

        return;
      }
    }
    console.error("User is not defined");
  };

  const onLater = async () => {
    if (user) {
      await updateUser({ flags: [...user.flags, "IS_ONBOARDED"] });
    }

    if (userQuestions && userQuestions.length > 0) {
      const questionId = userQuestions[0].id;
      navigate(routes.question.replace(":questionId", questionId));

      return;
    }
    console.error("Что-то пошло не так, у юзера нет вопросов", {
      userQuestions,
    });
    navigate(routes.profile);
  };

  return (
    <View id={id} activePanel={id} className={"h-full"}>
      <Panel id={id} className={"h-full"}>
        <PanelHeader>Добро пожаловать ❤️</PanelHeader>

        <OnboardingContentWrapper>
          <Title className={""}>Обмен мнениями</Title>
          <div className={"pt-4"}>
            <CardGrid size="l">
              <Card className={"p-4"}>
                <Text weight="1" className={"text-center"}>
                  Отвечайте на вопросы других людей и они ответят на ваш
                </Text>
              </Card>
            </CardGrid>
            {/*<p className={"pt-4"}>*/}
            {/*  Приложение построено по принципу обмена обратной связью. На ваш*/}
            {/*  вопрос будут отвечать другие пользователи, если вы ответите на их*/}
            {/*  вопросы.*/}
            {/*</p>*/}
            {/*<p className={"pt-4"}>*/}
            {/*  Ваше мнение важно, оно поможет людям стать лучше. Поэтому,*/}
            {/*  пожалуйста, не стесняйтесь и отвечайте на вопросы других*/}
            {/*  пользователей.*/}
            {/*</p>*/}
          </div>
          <PromoBlock41 className={"mt-12 self-center "} />
          <ButtonGroup className={""} mode={"horizontal"} align={"center"}>
            <Button
              className={"self-center"}
              size={"l"}
              onClick={onLater}
              appearance={"neutral"}
            >
              Позже
            </Button>
            <Button className={"self-center mt-auto"} size={"l"} onClick={onGo}>
              Поехали
            </Button>
          </ButtonGroup>
        </OnboardingContentWrapper>
      </Panel>
    </View>
  );
};

export default Onboarding4;
