import React, { FC, useContext, useMemo } from "react";
import "@vkontakte/vkui/dist/vkui.css";
import {
  AppRoot,
  PanelHeader,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  usePlatform,
} from "@vkontakte/vkui";

import { Platform } from "@vkontakte/vkui/src/lib/platform";
import { useNavigate } from "react-router-dom";
import { PageNames, PagePath, routes } from "./routes";
import MenuPanel from "./components/menu-panel/MenuPanel";
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
  // useAds();

  const [isActiveProfileBtn] = useProfileBtnStore((state) => [
    state.isActive,
    state.setIsProfileBtnActive,
    state.setVkProfileId,
  ]);

  const { activeAlert } = useContext(AlertContext);

  let activeStory: PageNames = useMemo(() => {
    return (path.split("/")[1] || "feed") as PageNames;
  }, [path]);

  const adaptivity = useAdaptivity();
  const platform = usePlatform() as Platform;
  const hasHeader = platform !== "vkcom";
  const isDesktop = adaptivity.viewWidth > 2;

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

  const onStoryChange = (e: any) =>
    navigate("/" + e.currentTarget.dataset.story);

  console.log({ adaptivity, platform, path, activeStory });

  if (platform === "ios") {
    activeStory = "apple";
  }

  return (
    <AppRoot
      style={{ paddingTop: isDesktop ? 16 : 0, boxSizing: "border-box" }}
    >
      <SplitLayout
        header={hasHeader && <PanelHeader separator={false} />}
        style={{
          justifyContent: "center",
        }}
        modal={<Modals />}
        popout={activeAlert}
      >
        {isDesktop && (
          <MenuPanel
            onStoryChange={onStoryChange}
            hasHeader={hasHeader}
            activeStory={activeStory}
            className={activeStory.includes("onboarding") ? "hidden" : ""}
          />
        )}

        <SplitCol
          animate={!isDesktop}
          spaced={isDesktop}
          // width={isDesktop ? "760px" : "100%"}
          maxWidth={isDesktop ? "1000px" : "100%"}
        >
          <EpicMenu
            onStoryChange={onStoryChange}
            activeStory={activeStory}
            isDesktop={isDesktop}
          />
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
};

export default Page;
