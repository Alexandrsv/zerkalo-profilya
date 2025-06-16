import bridge from "@vkontakte/vk-bridge";

export const bridgeAddToFavourite = async () => {
  try {
    const rez = await bridge.send("VKWebAppAddToFavorites");

    return !!rez?.result;
  } catch (error) {
    return false;
  }
};
