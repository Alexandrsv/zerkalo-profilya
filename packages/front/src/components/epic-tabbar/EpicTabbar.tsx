import React, { MouseEvent } from "react";
import { Tabbar, TabbarItem } from "@vkontakte/vkui";
import {
  Icon28NewsfeedOutline,
  Icon28Profile,
  Icon28SettingsOutline,
} from "@vkontakte/icons";
import { PageNames } from "../../routes";
import { panelNames } from "../../const/panel-names";
import { UnseenBannerNotification } from "../unseen-banner-notification/UnseenBannerNotification";
import { useProfileBtnStore } from "@/store/profileBtnStore";
import { checkUnwatchedFeedback } from "@/utils/check-unwatched-feedback";
import { useQuestions } from "@/hooks/use-questions";

interface EpicTabbarProps {
  activeStory: PageNames;
  onStoryChange: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
}

export const EpicTabbar = ({
  activeStory,
  onStoryChange,
  className,
}: EpicTabbarProps) => {
  const { questions } = useQuestions({ owner: true });

  const hasUnwatched = checkUnwatchedFeedback(questions);

  return (
    <Tabbar className={className}>
      <TabbarItem
        onClick={onStoryChange}
        selected={activeStory === "feed"}
        data-story="feed"
        label={panelNames.feed}
      >
        <Icon28NewsfeedOutline />
      </TabbarItem>
      <TabbarItem
        onClick={onStoryChange}
        selected={activeStory === "profile"}
        data-story="profile"
        indicator={hasUnwatched && <UnseenBannerNotification extraText={"!"} />}
        label={panelNames.profile}
      >
        <Icon28Profile />
      </TabbarItem>
      <TabbarItem
        onClick={onStoryChange}
        selected={activeStory === "settings"}
        data-story="settings"
        label={panelNames.settings}
      >
        <Icon28SettingsOutline />
      </TabbarItem>
    </Tabbar>
  );
};
