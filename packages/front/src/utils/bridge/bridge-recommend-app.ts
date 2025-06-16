import bridge from "@vkontakte/vk-bridge";

interface VKWebAppRecommendResult {
  result: boolean;
}

export const bridgeRecommendApp = async (): Promise<boolean> => {
  try {
    const rez = await bridge.send("VKWebAppRecommend");

    return !!(rez as VKWebAppRecommendResult).result;
  } catch (error) {
    return false;
  }
};
