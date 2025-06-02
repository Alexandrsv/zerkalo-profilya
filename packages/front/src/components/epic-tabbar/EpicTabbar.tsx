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

interface EpicTabbarProps {
  activeStory: PageNames;
  onStoryChange: (e: MouseEvent<HTMLElement>) => void;
}

export const EpicTabbar = ({ activeStory, onStoryChange }: EpicTabbarProps) => {
  const [vk_profile_id, isActive] = useProfileBtnStore((state) => [
    state.vk_profile_id,
    state.isActive,
  ]);

  return (
    <Tabbar className={"!py-2"}>
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
        indicator={
          isActive && <UnseenBannerNotification extraText={vk_profile_id} />
        }
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
