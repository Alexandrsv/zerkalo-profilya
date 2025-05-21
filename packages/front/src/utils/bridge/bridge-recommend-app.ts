import bridge from "@vkontakte/vk-bridge";

export const bridgeRecommendApp = async () => {
  try {
    // @ts-ignore
    const rez = await bridge.send("VKWebAppRecommend");
    // @ts-ignore
    return !!rez?.result;
  } catch (error) {
    return false;
  }
};
