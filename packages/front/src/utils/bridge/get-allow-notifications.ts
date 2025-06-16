import bridge from "@vkontakte/vk-bridge";
import { addUserToHSFetcher, IUser } from "../../api/user";
import { ISnackbarContextModel } from "../../context/SnackbarContext";
import { UpdateUser } from "../../hooks/use-app-user";
import { GROUP_ID } from "../../const/group-id";
import ym from "react-yandex-metrika";

export const bridgeAllowGroupMessages = async () => {
  return await bridge
    .send("VKWebAppAllowMessagesFromGroup", {
      group_id: GROUP_ID,
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

export const bridgeAllowPush = async () => {
  return await bridge
    .send("VKWebAppAllowNotifications")
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.log("bridgeAllowPush", e);

      return false;
    });
};

export const getAllowNotifications = async (
  user: IUser,
  updateUser: UpdateUser,
  showSnackbar?: ISnackbarContextModel["showSnackbar"]
) => {
  let isGroupMessagesAllowed = false;
  const isAllowPush = await bridgeAllowPush();

  if (isAllowPush) {
    isGroupMessagesAllowed = await bridgeAllowGroupMessages();
  }

  if (isGroupMessagesAllowed || isAllowPush) {
    const flags =
      user.flags.filter((f) => f !== "IS_CANCEL_PUSH_NOTIFICATION") || [];

    if (isAllowPush) {
      flags.push("IS_ALLOW_PUSH_NOTIFICATION");
      ym("reachGoal", "allow-push");
    }

    if (isGroupMessagesAllowed) {
      flags.push("IS_ALLOW_GROUP_MESSAGES");
      await addUserToHSFetcher(user.id);
      ym("reachGoal", "allow-group-messages");
    }

    await updateUser({
      flags,
    });

    showSnackbar &&
      showSnackbar({
        text: "Уведомления включены\nОтключить можно в настройках",
      });
  }
};
