import React from "react";
import { Button } from "@vkontakte/vkui";
import { routes } from "@/routes";
import { EModals } from "@/context/ModalContext";
import { useModal } from "@/hooks/use-modal";
import { useNavigate } from "react-router-dom";
import bridge from "@vkontakte/vk-bridge";
import { GROUP_ID } from "@/const/group-id";
import { bridgeAddAppToProfile } from "@/utils/bridge/bridge-add-app-to-profile";
import { useAppUser } from "@/hooks/use-app-user";

const Dev = () => {
  const { setModal } = useModal();
  const navigate = useNavigate();
  // const { Try } = usePromoEvents({ mode: "global" });
  const { user } = useAppUser();

  const addAppToUserVkProfile = async () => {
    // eslint-disable-next-line no-console
    console.debug("addAppToUserVkProfile");
    const rez = await bridgeAddAppToProfile();

    if ("error" in rez && rez.error === 14) {
      if (user?.flags.includes("IS_ONBOARDED")) {
        // Handle onboarded user case
      }
      // eslint-disable-next-line no-console
      console.debug("addAppToUserVkProfile success");
    }
    // eslint-disable-next-line no-console
    console.debug({ rez });
  };

  async function addAppToFavorites() {
    void (await bridge.send("VKWebAppAddToFavorites"));
  }

  async function addAppToUserHomeScreen() {
    await bridge.send("VKWebAppAddToHomeScreenInfo").then((data) => {
      if (data.is_feature_supported && !data.is_added_to_home_screen) {
        bridge.send("VKWebAppAddToHomeScreen");
      }
    });
  }

  async function enableAppNotification() {
    await bridge.send("VKWebAppAllowNotifications");
  }

  async function joinToAppGroup() {
    await bridge.send("VKWebAppJoinGroup", { group_id: GROUP_ID });
  }

  async function subscribeOnAppGroupMessages() {
    await bridge.send("VKWebAppAllowMessagesFromGroup", {
      group_id: GROUP_ID,
      key: "feedback_app",
    });
  }

  async function recommend() {
    await bridge.send("VKWebAppRecommend");
  }

  async function showStory() {
    await bridge.send("VKWebAppShowStoryBox", {
      // background_type: "image",
      // attachment: {
      //   type: "url",
      //   url: "https://picsum.photos/720/1280",
      //   text: "more",
      //   owner_id: 1,
      //   id: 1,
      // },
      background_type: "image",
      // url: "https://sun9-65.userapi.com/c850136/v850136098/1b77eb/0YK6suXkY24.jpg",
      stickers: [
        {
          sticker_type: "renderable",
          sticker: {
            can_delete: false,
            content_type: "image",
            url: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Dialog.png",
            clickable_zones: [
              {
                action_type: "link",
                action: {
                  link: "https://vk.com/wall-166562603_1192",
                  tooltip_text_key: "tooltip_open_post",
                },
                clickable_area: [
                  {
                    x: 17,
                    y: 110,
                  },
                  {
                    x: 97,
                    y: 110,
                  },
                  {
                    x: 97,
                    y: 132,
                  },
                  {
                    x: 17,
                    y: 132,
                  },
                ],
              },
            ],
          },
        },
      ],
      blob: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNjAiIGhlaWdodD0iNjQwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InJlZCIvPjx0ZXh0IHg9IjEwIiB5PSI1MCIgZmlsbD0iYmxhY2siPkhlbGxvIFdvcmxkPC90ZXh0Pjxzd2l0Y2g+PGZvcmVpZ25PYmplY3QgeD0iMjAiIHk9IjkwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCI+PHAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiIGNsYXNzPSJ3LTEwIj5UZXh0IGdvZXMgaGVyZTwvcD48L2ZvcmVpZ25PYmplY3Q+PHRleHQgeD0iMjAiIHk9IjIwIj5Zb3VyIFNWRyB2aWV3ZXIgY2Fubm90IGRpc3BsYXkgaHRtbC48L3RleHQ+PC9zd2l0Y2g+PC9zdmc+",
    });
  }

  async function openWallPost() {
    await bridge.send("VKWebAppShowWallPostBox", {
      message: "Hello world",
      attachments: "https://habr.com,photo142445306_457241602",
    });
  }

  async function inviteFriends() {
    await bridge
      .send("VKWebAppShowInviteBox", {})
      .then((data) => {
        // eslint-disable-next-line no-console
        console.debug(data.success);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.debug(error);
      });
  }

  return (
    <div>
      {/*<Button onClick={Try}>Try</Button>*/}
      <details>
        <summary>кнопки</summary>
        <div className={"flex gap-4 flex-wrap"}>
          <Button onClick={() => navigate(routes.onboarding_1)}>
            Онбординг
          </Button>
          <Button onClick={() => setModal({ modalName: EModals.ADD_QUESTION })}>
            ткь2
          </Button>
          <Button onClick={addAppToUserVkProfile}>Добавить в профиль</Button>
          <Button onClick={addAppToFavorites}>Добавить в избранное</Button>
          <Button onClick={enableAppNotification}>Включить уведомления</Button>
          <Button onClick={joinToAppGroup}>Подписаться на сообщество</Button>
          <Button onClick={subscribeOnAppGroupMessages}>
            Подписаться на рассылку сообщества
          </Button>
          <Button onClick={addAppToUserHomeScreen}>
            Добавить на рабочий стол
          </Button>
          <Button onClick={recommend}>Порекомендовать приложение</Button>
          <Button onClick={showStory}>Открыть историю</Button>
          <Button onClick={openWallPost}>Разместить пост</Button>
          <Button onClick={inviteFriends}>Пригласить друзей</Button>
          <Button onClick={() => navigate("/p")}>404</Button>
        </div>
      </details>
      {/*<StoryHoc>*/}
      {/*  <ShowFeedbackStory />*/}
      {/*</StoryHoc>*/}
    </div>
  );
};

export default Dev;
