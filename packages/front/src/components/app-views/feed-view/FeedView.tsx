import React, { FC } from "react";
import {
  Div,
  Group,
  Panel,
  PanelHeader,
  PanelSpinner,
  Placeholder,
  View,
} from "@vkontakte/vkui";
import { PageNames } from "../../../routes";
import { useQuestions } from "../../../hooks/use-questions";
import { QuestionsList } from "../../questions-list/QuestionsList";
import { panelNames } from "../../../const/panel-names";
import { Icon56QuestionOutline } from "@vkontakte/icons";
import HelpBtn from "../../help-btn/HelpBtn";
import PromoCard from "../../notification-card/PromoCard";

const ListQuestionsIsEmpty: FC = () => {
  return (
    <Div className={"flex justify-center items-center mb-20"}>
      <Placeholder
        icon={<Icon56QuestionOutline width={90} height={90} />}
        header="Похоже, что вопросы для вас закончились"
        // action={<Button size="s">йцу</Button>}
      >
        Ваше мнение важно для людей и помогает им стать лучше. <br /> Заходите
        позже ❤️
      </Placeholder>
    </Div>
  );
};

const FeedView: FC<{ id: PageNames }> = ({ id }) => {
  const { questions } = useQuestions({ owner: false });

  if (typeof questions === "object" && questions.length === 0) {
    return <ListQuestionsIsEmpty />;
  }

  return (
    <View id={id} activePanel={id}>
      <Panel id={id}>
        <PanelHeader>{panelNames.feed + " вопросов"}</PanelHeader>
        {!questions ? (
          <PanelSpinner />
        ) : (
          <Group>
            {typeof questions === "object" && questions.length === 0 ? (
              <ListQuestionsIsEmpty />
            ) : (
              <QuestionsList questions={questions} />
            )}
            <HelpBtn />
          </Group>
        )}
        <PromoCard />
      </Panel>
    </View>
  );
};

export default FeedView;
