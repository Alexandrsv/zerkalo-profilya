import React, { FC } from "react";
import { EpicTabbar } from "../epic-tabbar/EpicTabbar";
import {
  Cell,
  Epic,
  Group,
  Panel,
  ScreenSpinner,
  useAdaptivityConditionalRender,
  View,
} from "@vkontakte/vkui";
import { PageNames, routes } from "../../routes";
import FeedView from "../app-views/feed-view/FeedView";
import ProfileView from "../app-views/profile-view/ProfileView";
import SettingsView from "../app-views/settings-view/SettingsView";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuestions } from "../../hooks/use-questions";
import BannedView from "../app-views/banned-view/BannedView";
import Page404 from "../app-views/404/Page404";
import AppleView from "../app-views/apple-view/AppleView";
import QuestionView from "@/components/app-views/question-view/QuestionView";
import Onboarding1 from "@/components/onboarding-views/Onboarding1";
import Onboarding2 from "@/components/onboarding-views/Onboarding2";
import Onboarding3 from "@/components/onboarding-views/Onboarding3";
import Onboarding4 from "@/components/onboarding-views/Onboarding4";
import NoMoreQuestionsView from "@/components/app-views/no-more-questions-view/NoMoreQuestions";

export interface EpicMenuProps {
  onStoryChange: (e: React.MouseEvent<HTMLElement>) => void;
  activeStory: PageNames;
  isDesktop: boolean;
}

const EpicMenu: FC<EpicMenuProps> = ({
  activeStory,
  onStoryChange,
  isDesktop,
}) => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [popout, setPopout] = useState<React.ReactNode>(null);

  const additionalPaths = pathname.split("/").slice(2);
  const questionId =
    additionalPaths.length > 0 ? additionalPaths[0] : undefined;

  useEffect(() => {
    setIsLoading(true);
    setPopout(<ScreenSpinner state="loading" />);
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setPopout(null);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <Epic
      activeStory={activeStory}
      tabbar={
        !isDesktop && (
          <EpicTabbar activeStory={activeStory} onStoryChange={onStoryChange} />
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
