import React, { FC } from "react";
import { Badge, Tabbar, TabbarItem } from "@vkontakte/vkui";
import {
  Icon28NewsfeedOutline,
  Icon28SettingsOutline,
  Icon28UserCircleOutline,
} from "@vkontakte/icons";
import { PageNames } from "../../routes";
import { panelNames } from "../../const/panel-names";
import { useQuestions } from "../../hooks/use-questions";
import { checkUnwatchedFeedback } from "../../utils/check-unwatched-feedback";

const EpicTabbar: FC<{
  onStoryChange: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  activeStory: PageNames;
  className?: string;
}> = ({ onStoryChange, activeStory, className }) => {
  const { questions } = useQuestions({ owner: true });
  const hasUnwatched = checkUnwatchedFeedback(questions);
  return (
    <Tabbar className={className}>
      <TabbarItem
        onClick={onStoryChange}
        selected={activeStory === "feed"}
        data-story="feed"
        text={panelNames.feed}
      >
        <Icon28NewsfeedOutline />
      </TabbarItem>
      <TabbarItem
        onClick={onStoryChange}
        selected={activeStory === "profile"}
        data-story="profile"
        indicator={
          hasUnwatched && <Badge mode="prominent" className={"animate-pulse"} />
        }
        text={panelNames.profile}
      >
        <Icon28UserCircleOutline />
      </TabbarItem>
      <TabbarItem
        onClick={onStoryChange}
        selected={activeStory === "settings"}
        data-story="settings"
        // indicator={<Badge mode="prominent" />}
        text={panelNames.settings}
      >
        <Icon28SettingsOutline />
      </TabbarItem>
    </Tabbar>
  );
};

export default EpicTabbar;
