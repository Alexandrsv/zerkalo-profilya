import React, { FC, useContext, useMemo } from "react";
import "@vkontakte/vkui/dist/vkui.css";
import {
  AppRoot,
  PanelHeader,
  Platform,
  SplitCol,
  SplitLayout,
  usePlatform,
} from "@vkontakte/vkui";
import { useNavigate } from "react-router-dom";
import { PageNames, PagePath, routes } from "./routes";
import EpicMenu from "./components/epic-menu/EpicMenu";
import { Modals } from "./components/modals/Modals";
import AlertContext from "./context/AlertContext";
import { useAppUser } from "./hooks/use-app-user";
import { useProfileBtnStore } from "./store/profileBtnStore";
import { usePromoEvents } from "./hooks/use-promo-events";

const Page: FC<{ path: PagePath }> = ({ path = "/feed" }) => {
  const { user } = useAppUser();
  const navigate = useNavigate();
  usePromoEvents({ mode: "global" });

  const [isActiveProfileBtn] = useProfileBtnStore((state) => [
    state.isActive,
    state.setIsProfileBtnActive,
    state.setVkProfileId,
  ]);

  const { activeAlert } = useContext(AlertContext);

  let activeStory: PageNames = useMemo(() => {
    return (path.split("/")[1] || "feed") as PageNames;
  }, [path]);

  // const adaptivity = useAdaptivity();
  const platform = usePlatform();
  const hasHeader = platform !== Platform.VKCOM;
  const isDesktop = false;

  if (user && user.banned) {
    activeStory = "banned";
  } else if (!isActiveProfileBtn && path !== routes["no-more-questions"]) {
    if (
      user &&
      !user.flags.includes("IS_ONBOARDED") &&
      activeStory !== "question"
    ) {
      if (!activeStory.includes("onboarding")) {
        activeStory = "onboarding_1";
      }
    }
  }

  const onStoryChange = (e: React.MouseEvent<HTMLElement>) =>
    navigate("/" + e.currentTarget.dataset.story);

  if (platform === Platform.IOS) {
    activeStory = "apple";
  }

  return (
    <AppRoot
      style={{ paddingTop: isDesktop ? 16 : 0, boxSizing: "border-box" }}
    >
      <SplitLayout
        header={hasHeader && <PanelHeader />}
        center
        modal={<Modals />}
        popout={activeAlert}
      >
        <SplitCol
          animate={!isDesktop}
          width="100%"
          maxWidth="560px"
          stretchedOnMobile
          autoSpaced
        >
          <EpicMenu onStoryChange={onStoryChange} activeStory={activeStory} />
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
};

export default Page;
