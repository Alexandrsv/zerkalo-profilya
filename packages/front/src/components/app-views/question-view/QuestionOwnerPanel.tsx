import React, { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Div,
  FormItem,
  Group,
  PanelSpinner,
  Select,
  SimpleCell,
  Switch,
  Tabs,
  TabsItem,
  Text,
} from "@vkontakte/vkui";
import { IQuestion } from "../../../api/questions";
import { UpdateQuestion } from "../../../hooks/use-question";
import QuestionInfo from "./QuestionInfo";
import FeedbackItem from "./FeedbackItem";
import PromoCard from "../../notification-card/PromoCard";
import EmptyFeedbackPlaceholder from "./EmptyFeedbackPlaceholder";
import ym from "react-yandex-metrika";
import Alien from "../../alien/Alien";

const QuestionOwnerPanel: FC<{
  question?: IQuestion | null;
  updateQuestion: UpdateQuestion;
}> = ({ question, updateQuestion }) => {
  const [activeTab, setActiveTab] = useState<"feedback" | "settings">(
    "feedback"
  );
  const [sex, setSex] = useState("0");
  const [isTryToDon, setIsTryToDon] = useState(false);

  useEffect(() => {
    ym("reachGoal", "show-question-settings");
  }, []);
  const onTryToDon = () => {
    ym("reachGoal", "try-to-don");
    setIsTryToDon(true);
  };

  const onChangeSex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "0") setIsTryToDon(false);
    ym("reachGoal", "try-to-change-question-target-sex");
    setSex(e.target.value);
  };
  const onClickPlayStop = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | ChangeEvent<HTMLInputElement>
  ) => {
    e.stopPropagation();
    if (question) {
      void updateQuestion(question.id, {
        isActive: !question.isActive,
      });
    }
  };

  return (
    <Group>
      {!!question && (
        <div>
          <QuestionInfo question={question} />
          <Div>
            <Tabs mode={"accent"}>
              <TabsItem
                selected={activeTab === "feedback"}
                onClick={() => setActiveTab("feedback")}
                id="tab-feedback-list"
                aria-controls="tab-content-feedback-list"
              >
                Список ответов
              </TabsItem>
              <TabsItem
                selected={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
                id="tab-settings"
                aria-controls="tab-content-settings"
                after={<Badge mode="prominent" className={"align-sub"} />}
              >
                Настройки
              </TabsItem>
            </Tabs>
          </Div>
          {activeTab === "settings" && (
            <>
              <SimpleCell
                Component="label"
                after={
                  <Switch
                    // onClick={onClickPlayStop}
                    onChange={onClickPlayStop}
                    checked={!question?.isActive}
                  />
                }
              >
                Скрыть из ленты
              </SimpleCell>
              <FormItem
                top={
                  <div className={"flex "}>
                    Выберите пол аудитории
                    <Badge mode="prominent" className={"ml-1"} />
                  </div>
                }
                bottom={
                  "Вопрос будет отображатсья в ленте только для людей выбранного пола"
                }
              >
                <Select
                  value={sex}
                  selectType="default"
                  onChange={onChangeSex}
                  options={[
                    { label: "Любой", value: "0" },
                    { label: "Мужчины", value: "1" },
                    { label: "Женщины", value: "2" },
                  ]}
                />
              </FormItem>
              {sex !== "0" && (
                <Card className={"mx-4 p-4"}>
                  <Text>
                    Это функционал доступен только для тех, кто поддерживает
                    приложение через VK DON
                  </Text>
                  <Button
                    className={"!mt-4"}
                    onClick={onTryToDon}
                    after={<div className={"border-l-2 pl-2"}>250 ₽</div>}
                  >
                    Поддержать
                  </Button>
                </Card>
              )}
              {isTryToDon && (
                <Card className={"m-4 p-4"}>
                  <Text>
                    <Alien />
                    &nbsp; Фича в разарботке, сообщу, как будет готова
                  </Text>
                </Card>
              )}
            </>
          )}
          {activeTab === "feedback" && (
            <Div>
              {question?.feedback.map((feedback, i) => (
                <FeedbackItem
                  key={feedback.id}
                  feedback={feedback}
                  questionId={question.id}
                  questionText={question.questionText}
                  withoutSeparator={question.feedback.length === i + 1}
                  isQuestionAuthor={true}
                />
              ))}
              <PromoCard />
              {question?.feedback.length === 0 && (
                <EmptyFeedbackPlaceholder questionId={question.id} />
              )}
            </Div>
          )}
        </div>
      )}
      {!question && <PanelSpinner />}
    </Group>
  );
};

export default QuestionOwnerPanel;
