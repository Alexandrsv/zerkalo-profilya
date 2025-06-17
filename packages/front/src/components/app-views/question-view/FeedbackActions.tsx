import React, { FC } from "react";
import { IconButton } from "@vkontakte/vkui";
import {
  Icon28DeleteOutlineAndroid,
  Icon28ShareOutline,
} from "@vkontakte/icons";
import { useQuestion } from "../../../hooks/use-question";
import AbuseBtn from "../../abuse-btn/AbuseBtn";
import { useReportAbuse } from "../../../hooks/use-report-abuse";
import ym from "react-yandex-metrika";
import { ShowFeedbackStory } from "../../story/ShowFeedbackStory";
import { bridgeWebAppShare } from "@/utils/bridge/bridge-web-app-share";

const FeedbackActions: FC<{
  questionId: string;
  feedbackId: string;
  isQuestionAuthor: boolean;
  questionText: string;
  feedbackText: string;
}> = ({
  questionId,
  feedbackId,
  isQuestionAuthor,
  questionText,
  feedbackText,
}) => {
  const { deleteFeedback } = useQuestion(questionId);
  const { showAbuseModal } = useReportAbuse();

  const onRemove = async () => {
    void (await deleteFeedback(feedbackId));
  };

  const onClickAbuse = async () => {
    showAbuseModal({ questionId, feedbackId });
  };

  const wallPostHandler = async () => {
    let post;
    const url = `https://vk.com/app51465205#/question/${questionId}/?feedback=${feedbackId}`;

    try {
      post = await bridgeWebAppShare(url);
    } catch (e) {
       
      console.error("Failed to share feedback:", e);
    }

    if (post) {
      ym("reachGoal", "wall-post-from-question-feedback");
    }
  };

  return (
    <div className={"flex w-full justify-between"}>
      <div className={"flex"}>
        {/*{isLiked ? (*/}
        {/*  <IconButton onClick={() => setIsLiked(!isLiked)}>*/}
        {/*    <Icon28Like width={25} fill={"#fc3044"} />*/}
        {/*  </IconButton>*/}
        {/*) : (*/}
        {/*  <IconButton onClick={() => setIsLiked(!isLiked)}>*/}
        {/*    <Icon28LikeOutline width={25} fill={"#828a99"} />*/}
        {/*  </IconButton>*/}
        {/*)}*/}
        {isQuestionAuthor && (
          <>
            <ShowFeedbackStory
              questionText={questionText}
              feedbackText={feedbackText}
              questionId={questionId}
              feedbackId={feedbackId}
            />
            <IconButton
              title={"Поделиться ответом на стене"}
              onClick={wallPostHandler}
            >
              <Icon28ShareOutline width={25} fill={"#828a99"} />
            </IconButton>
          </>
        )}
      </div>
      <div className={"flex justify-end w-full"}>
        <IconButton className={""} onClick={onRemove}>
          <Icon28DeleteOutlineAndroid width={25} fill={"#828a99"} />
        </IconButton>
        <AbuseBtn onCLick={onClickAbuse} size={25} className={"p-[10px]"} />
      </div>
    </div>
  );
};

export default FeedbackActions;
