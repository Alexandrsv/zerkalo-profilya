import React, { FC } from "react";
import EpicTabbar from "../epic-tabbar/EpicTabbar";
import { Epic } from "@vkontakte/vkui";
import { PageNames } from "../../routes";
import ProfileView from "../app-views/profile-view/ProfileView";
import FeedView from "../app-views/feed-view/FeedView";
import SettingsView from "../app-views/settings-view/SettingsView";
import QuestionView from "../app-views/question-view/QuestionView";
import Onboarding1 from "../onboarding-views/Onboarding1";
import Onboarding2 from "../onboarding-views/Onboarding2";
import Onboarding3 from "../onboarding-views/Onboarding3";
import Onboarding4 from "../onboarding-views/Onboarding4";
import AppleView from "../app-views/apple-view/AppleView";
import Page404 from "../app-views/404/Page404";
import BannedView from "../app-views/banned-view/BannedView";
import NoMoreQuestionsView from "../app-views/no-more-questions-view/NoMoreQuestions";
import { useProfileBtnStore } from "../../store/profileBtnStore";

const EpicMenu: FC<{
  onStoryChange: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  activeStory: PageNames;
  isDesktop: boolean;
  className?: string;
}> = ({ activeStory, onStoryChange, isDesktop, className }) => {
  const isActiveProfileBtn = useProfileBtnStore((state) => state.isActive);

  let isHiddenEpicNav = false;
  if (activeStory.includes("onboarding")) isHiddenEpicNav = true;
  if (isActiveProfileBtn) isHiddenEpicNav = true;

  return (
    <Epic
      activeStory={activeStory}
      className={className}
      tabbar={
        !isDesktop && (
          <EpicTabbar
            activeStory={activeStory}
            onStoryChange={onStoryChange}
            className={isHiddenEpicNav ? "hidden" : ""}
          />
        )
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
