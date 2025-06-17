import { useEffect, useState } from "react";
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge";
import ym from "react-yandex-metrika";
import { isDev } from "@/const/constants";

type AdFormat = "reward";

// Unused interfaces prefixed with underscore
interface _VKWebAppCheckNativeAdsParams {
  ad_format: AdFormat;
}

interface _VKWebAppShowNativeAdsParams {
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
        // Debug logs (only in development)
        if (isDev) {
          // eslint-disable-next-line no-console
          console.log({ data });
        }

        if (data.result) {
          // Предзагруженные материалы есть
          setHasNativeAds(true);
        } else {
          // Материалов нет
          setHasNativeAds(false);
        }
      })
      .catch((error) => {
        console.error("Failed to check native ads:", error);
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
        console.error("Failed to show native ads:", error);
      });
  };

  return { hasNativeAds, showNativeAds };
};
