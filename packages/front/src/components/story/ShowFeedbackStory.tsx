import React, { FC } from "react";
import bridge from "@vkontakte/vk-bridge";
import { getFeedbackStoryOptions } from "../../utils/story/get-feedback-story-input";
import { IconButton } from "@vkontakte/vkui";
import { Icon28Story } from "@vkontakte/icons";
import ym from "react-yandex-metrika";

export const ShowFeedbackStory: FC<{
  encodedData?: string;
  questionText: string;
  feedbackText: string;
  questionId: string;
  feedbackId: string;
}> = ({ questionText, feedbackText, questionId, feedbackId }) => {
  async function showStory() {
    let story;
    try {
      story = await bridge.send(
        "VKWebAppShowStoryBox",
        getFeedbackStoryOptions({
          feedbackId,
          questionId,
          questionText,
          feedbackText,
          ownerId: 342342,
        })
      );
    } catch (e) {
      console.log(e);
    }
    if (story) {
      ym("reachGoal", "story-post");
    }
  }

  return (
    <IconButton title={"Поделиться в истории"} onClick={showStory}>
      <Icon28Story fill={"grey"} />
    </IconButton>
  );
};
