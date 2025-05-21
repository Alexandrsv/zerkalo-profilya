import React, { FC, useLayoutEffect } from "react";
import { Panel, PanelHeader, PanelSpinner, View } from "@vkontakte/vkui";
import { PageNames, routes } from "../../../routes";
import { useNavigate, useParams } from "react-router-dom";
import { useQuestion } from "../../../hooks/use-question";
import { useProfileBtnStore } from "../../../store/profileBtnStore";
import QuestionOwnerPanel from "./QuestionOwnerPanel";
import QuestionPanel from "./QuestionPanel";
import { useAppUser } from "../../../hooks/use-app-user";
import QuestionProfileBtnPanel from "./QuestionProfileBtnPanel";

//TODO: Компонент - говно, надо отрефакторить

export type QuestionPanelId =
  | "question-panel"
  | "question-owner-panel"
  | "question-profile-btn-panel"
  | "loading";

const QuestionView: FC<{ id: PageNames }> = ({ id }) => {
  const { user: appUser } = useAppUser();

  let { questionId = "" } = useParams();

  const [isActiveBtnProfile] = useProfileBtnStore((state) => [
    state.isActive,
    state.setIsProfileBtnActive,
  ]);

  let isQuestionAuthor: boolean = false;
  const { question, createFeedback, updateQuestion } = useQuestion(questionId);

  console.log({ question, questionId });
  if (appUser?.id && question?.authorId) {
    isQuestionAuthor = appUser?.id === +question?.authorId;
  }

  const getActivePanel = (): QuestionPanelId => {
    if (isActiveBtnProfile) return "question-profile-btn-panel";
    if (!question) return "loading";
    if (isQuestionAuthor) return "question-owner-panel";
    return "question-panel";
  };

  const activePanel = getActivePanel();

  // useEffect(() => {
  //   if (isQuestionAuthor !== undefined) {
  //     setActivePanel(
  //       getActivePanel()
  //     );
  //   }
  // }, [isQuestionAuthor]);

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (question === null) navigate(routes["404"]);
  }, [navigate, question]);

  console.log({ activePanel });

  return (
    <View id={id} activePanel={activePanel}>
      <Panel id={"question-owner-panel"}>
        <PanelHeader>Вопрос</PanelHeader>
        {activePanel === "question-owner-panel" && (
          <QuestionOwnerPanel
            question={question}
            updateQuestion={updateQuestion}
          />
        )}
      </Panel>
      <Panel id={"question-panel"}>
        <PanelHeader>Вопрос</PanelHeader>
        {activePanel === "question-panel" && (
          <QuestionPanel question={question} createFeedback={createFeedback} />
        )}
      </Panel>
      <Panel id={"question-profile-btn-panel"}>
        <PanelHeader>Вопрос</PanelHeader>
        {activePanel === "question-profile-btn-panel" && appUser && (
          <QuestionProfileBtnPanel
            appUser={appUser}
            question={question}
            createFeedback={createFeedback}
          />
        )}
      </Panel>
      <Panel id={"loading"}>
        <PanelHeader>Загрузка...</PanelHeader>
        <PanelSpinner />
      </Panel>
    </View>
  );
};

export default QuestionView;
