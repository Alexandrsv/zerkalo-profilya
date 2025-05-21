import { useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import ym from "react-yandex-metrika";

export const useAdsNative = () => {
  const [hasNativeAds, setHasNativeAds] = useState(false);

  useEffect(() => {
    bridge
      .send("VKWebAppCheckNativeAds", {
        // @ts-ignore
        ad_format: "reward" /* Тип рекламы */,
      })
      .then((data) => {
        console.log({ data });
        if (data.result) {
          // Предзагруженные материалы есть
          setHasNativeAds(true);
        } else {
          // Материалов нет
          setHasNativeAds(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const showNativeAds = () => {
    if (!hasNativeAds) {
      return;
    }
    bridge
      .send("VKWebAppShowNativeAds", {
        // @ts-ignore
        ad_format: "reward" /* Тип рекламы */,
      })
      .then((data) => {
        if (data.result) {
          // Реклама была показана
          ym("reachGoal", "native-ads");
        } else {
          // Ошибка
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return { hasNativeAds, showNativeAds };
};
