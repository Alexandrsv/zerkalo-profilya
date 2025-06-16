import { useEffect, useState } from "react";
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge";
import ym from "react-yandex-metrika";

type AdFormat = "reward";

interface VKWebAppCheckNativeAdsParams {
  ad_format: AdFormat;
}

interface VKWebAppShowNativeAdsParams {
  ad_format: AdFormat;
}

interface VKWebAppNativeAdsResult {
  result: boolean;
}

export const useAdsNative = () => {
  const [hasNativeAds, setHasNativeAds] = useState(false);

  useEffect(() => {
    bridge
      .send("VKWebAppCheckNativeAds", {
        ad_format: EAdsFormats.REWARD,
      })
      .then((data: VKWebAppNativeAdsResult) => {
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
        ad_format: EAdsFormats.REWARD,
      })
      .then((data: VKWebAppNativeAdsResult) => {
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
