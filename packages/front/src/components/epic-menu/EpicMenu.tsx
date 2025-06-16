import React, { FC } from "react";
import { EpicTabbar } from "../epic-tabbar/EpicTabbar";
import { Epic } from "@vkontakte/vkui";
import { PageNames } from "../../routes";
import FeedView from "../app-views/feed-view/FeedView";
import ProfileView from "../app-views/profile-view/ProfileView";
import SettingsView from "../app-views/settings-view/SettingsView";
import BannedView from "../app-views/banned-view/BannedView";
import Page404 from "../app-views/404/Page404";
import AppleView from "../app-views/apple-view/AppleView";
import QuestionView from "@/components/app-views/question-view/QuestionView";
import Onboarding1 from "@/components/onboarding-views/Onboarding1";
import Onboarding2 from "@/components/onboarding-views/Onboarding2";
import Onboarding3 from "@/components/onboarding-views/Onboarding3";
import Onboarding4 from "@/components/onboarding-views/Onboarding4";
import NoMoreQuestionsView from "@/components/app-views/no-more-questions-view/NoMoreQuestions";
import { useProfileBtnStore } from "@/store/profileBtnStore";

export interface EpicMenuProps {
  onStoryChange: (e: React.MouseEvent<HTMLElement>) => void;
  activeStory: PageNames;
}

const EpicMenu: FC<EpicMenuProps> = ({ activeStory, onStoryChange }) => {
  const isActiveProfileBtn = useProfileBtnStore((state) => state.isActive);

  let isHiddenEpicNav = false;
  if (activeStory.includes("onboarding")) isHiddenEpicNav = true;
  if (isActiveProfileBtn) isHiddenEpicNav = true;

  return (
    <Epic
      activeStory={activeStory}
      tabbar={
        <EpicTabbar
          activeStory={activeStory}
          onStoryChange={onStoryChange}
          className={isHiddenEpicNav ? "hidden !py-2" : " !py-2"}
        />
      }
    >
      <FeedView id={"feed"} />
      <ProfileView id={"profile"} />
      <SettingsView id={"settings"} />
      <QuestionView id={"question"} />
      <Onboarding1 id={"onboarding_1"} />
      <Onboarding2 id={"onboarding_2"} />
      <Onboarding3 id={"onboarding_3"} />
      <Onboarding4 id={"onboarding_4"} />
      <AppleView id={"apple"} />
      <Page404 id={"404"} />
      <BannedView id={"banned"} />
      <NoMoreQuestionsView id={"no-more-questions"} />
    </Epic>
  );
};

export default EpicMenu;
