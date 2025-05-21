import { useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { BannerAdLocation } from "@vkontakte/vk-bridge/dist/types/src/types/data";

export const useAds = () => {
  useEffect(() => {
    bridge
      .send("VKWebAppShowBannerAd", {
        banner_location: BannerAdLocation.BOTTOM,
        can_close: false,
      })
      .then((data) => {
        // @ts-ignore
        if (data.result) {
          // Баннерная реклама отобразилась
        }
        // console.log({ data });
      })
      .catch((_error) => {
        // Ошибка
        // console.log({ error });
      });
  }, []);
};
