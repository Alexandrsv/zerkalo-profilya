import { useAppUser } from "./use-app-user";
import { useCallback, useEffect, useRef } from "react";
import { bridgeRecommendApp } from "../utils/bridge/bridge-recommend-app";
import { bridgeAddToFavourite } from "../utils/bridge/bridge-add-to-favourite";
import { bridgeJoinToGroup } from "../utils/bridge/bridge-join-to-group";
import ym from "react-yandex-metrika";
import { bridgeAddAppToProfile } from "../utils/bridge/bridge-add-app-to-profile";
import { useProfileBtnStore } from "../store/profileBtnStore";
import { useActivityStore } from "../store/activityStore";

interface IUsePromoEventsParams {
  mode: "global" | "local";
}

export const usePromoEvents = (params?: IUsePromoEventsParams) => {
  // const INTERVAL_TIMEOUT = 5000;
  const INTERVAL_TIMEOUT = 1000 * 60 * 2;
  const { user, updateUser } = useAppUser();

  const isWriteText = useActivityStore((state) => state.isWriteText);
  const isWriteRef = useRef(isWriteText);
  isWriteRef.current = isWriteText;

  const isBtnProfileActive = useProfileBtnStore((state) => state.isActive);

  const addAppToProfile = useCallback(
    async function addAppToProfileHandler() {
      if (user && !user?.flags.includes("IS_ADD_TO_PROFILE")) {
        const addResult = await bridgeAddAppToProfile();
        if (!("error" in addResult)) {
          ym("reachGoal", "promo-global-add-app-to-profile");
          await updateUser({ flags: [...user.flags, "IS_ADD_TO_PROFILE"] });
        }
        return true;
      } else {
        return null;
      }
    },
    [user, updateUser]
  );

  const joinToGroup = useCallback(
    async function joinToGroupHandler() {
      if (user && !user?.flags.includes("IS_JOIN_TO_GROUP")) {
        const isJoin = await bridgeJoinToGroup();
        if (isJoin && user) {
          ym("reachGoal", "promo-global-join-to-group");
          await updateUser({ flags: [...user.flags, "IS_JOIN_TO_GROUP"] });
        }
        return isJoin;
      } else {
        return null;
      }
    },
    [user, updateUser]
  );
  const recommendApp = useCallback(
    async function recommendHandler() {
      if (user && !user?.flags.includes("IS_RECOMMEND_APP")) {
        const isRecommend = await bridgeRecommendApp();
        if (isRecommend && user) {
          ym("reachGoal", "promo-global-recommend-app");
          await updateUser({ flags: [...user.flags, "IS_RECOMMEND_APP"] });
        }
        return isRecommend;
      } else {
        return null;
      }
    },
    [user, updateUser]
  );

  const addToFavourite = useCallback(
    async function favouriteHandler() {
      if (user && !user?.flags.includes("IS_ADD_TO_FAVOURITE")) {
        ym("reachGoal", "promo-global-add-to-favourite");
        const isAddToFavourite = await bridgeAddToFavourite();
        if (isAddToFavourite && user) {
          await updateUser({ flags: [...user.flags, "IS_ADD_TO_FAVOURITE"] });
        }
        return isAddToFavourite;
      } else {
        return null;
      }
    },
    [updateUser, user]
  );

  useEffect(() => {
    const runEvent = async (events: Array<() => Promise<boolean | null>>) => {
      if (!events.length) return;
      const event = events.shift();
      if (event) {
        const isEvent = await event();
        if (isEvent === null) {
          await runEvent(events);
        } else {
          return;
        }
      } else {
        return;
      }
    };
    let interval: NodeJS.Timeout;
    if (params?.mode === "global") {
      let events = [recommendApp, addToFavourite, joinToGroup]; // список промо событий
      events = events.sort(() => Math.random() - 0.5);
      let lockEvent = false;
      interval = setInterval(async () => {
        if (!lockEvent && !isBtnProfileActive && !isWriteRef.current) {
          lockEvent = true;
          await runEvent([...events]);
          lockEvent = false;
        } else {
        }
      }, INTERVAL_TIMEOUT);
    }
    return () => {
      clearInterval(interval);
    };
  }, [
    INTERVAL_TIMEOUT,
    addAppToProfile,
    addToFavourite,
    isBtnProfileActive,
    joinToGroup,
    params?.mode,
    recommendApp,
  ]);

  const Try = async () => {
    await joinToGroup();
  };

  return { Try };
};
