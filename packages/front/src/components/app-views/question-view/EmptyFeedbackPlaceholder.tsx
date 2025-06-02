import { Button, Placeholder } from "@vkontakte/vkui";
import React, { FC } from "react";
import AppLogo from "../../../assets/app-logo.svg";
import bridge from "@vkontakte/vk-bridge";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import { GROUP_ID } from "../../../const/group-id";
import ym from "react-yandex-metrika";
import { bridgeQuestionWallPost } from "../../../utils/bridge/bridge-question-wall-post";

const statusList = ["post", "group", "end"] as const;

type Status = typeof statusList[number];

const EmptyFeedbackPlaceholder: FC<{ questionId: string }> = ({
  questionId,
}) => {
  const questionLocalStorageKey = `question-${questionId}`;

  let localStatus: Status = "post";
  try {
    localStatus =
      (localStorage.getItem(questionLocalStorageKey) as Status) || "post";
  } catch (e) {
    console.log(e);
  }

  const isCorrectStatus = statusList.some((status) => status === localStatus);

  const navigate = useNavigate();

  const [status, setStatus] = React.useState<Status>(
    isCorrectStatus ? localStatus : "post"
  );
  const isStatusPost = status === "post";
  const isStatusGroup = status === "group";
  const isStatusEnd = status === "end";

  const updateStatus = (newStatus: Status) => {
    setStatus(newStatus);
    try {
      localStorage.setItem(questionLocalStorageKey, newStatus);
    } catch (e) {
      console.log(e);
    }
  };

  const postStatusHandler = async () => {
    let post;
    try {
      post = await bridgeQuestionWallPost(questionId);
    } catch (e) {
      console.log(e);
    }
    if (post) {
      ym("reachGoal", "wall-post-from-empty-feedback");
      updateStatus("group");
    }
  };

  const groupStatusHandler = async () => {
    const joinResult = await bridge.send("VKWebAppJoinGroup", {
      group_id: GROUP_ID,
    });
    if (joinResult) {
      ym("reachGoal", "group-join-from-empty-feedback");
      updateStatus("end");
    }
  };

  const onButtonClick = async () => {
    if (status === "post") await postStatusHandler();
    if (status === "group") await groupStatusHandler();
    if (status === "end") navigate(routes.feed);
  };

  return (
    <div className={""}>
      <Placeholder
        icon={<AppLogo className={"w-28 h-28"} />}
        title="Пока еще никто не ответил"
        action={
          <Button size="m" onClick={onButtonClick}>
            {isStatusPost && "Рассказать"}
            {isStatusGroup && "Подпишись на группу приложения"}
            {isStatusEnd && "К ленте вопросов"}
          </Button>
        }
      >
        {isStatusPost && (
          <>
            Расскажите людям о своем вопросе, чтобы получить ответы <br />
            <b>( всего 2 клика )</b>
          </>
        )}
        {isStatusGroup && (
          <>
            Вступи в группу приложения, там будут обновления и рекомендации по
            получению максимальной пользы от ответов <br />
            <b>( еще 2 клика )</b>
          </>
        )}
        {isStatusEnd && (
          <>Отвечайте на вопросы других людей, чтобы получить ответы на свои</>
        )}
      </Placeholder>
    </div>
  );
};

export default EmptyFeedbackPlaceholder;
