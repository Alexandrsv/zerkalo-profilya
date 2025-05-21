import bridge from "@vkontakte/vk-bridge";
import { GROUP_ID } from "../../const/group-id";

export const bridgeJoinToGroup = async () => {
  try {
    const rez = await bridge.send("VKWebAppJoinGroup", { group_id: GROUP_ID });
    return !!rez?.result;
  } catch (error) {
    return false;
  }
};
