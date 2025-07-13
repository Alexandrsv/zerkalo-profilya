import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge/dist/types/src/types/data";
import fromEntries from "object.fromentries";

// тип GetLaunchParamsResponseString в котором все значения GetLaunchParamsResponse приведены к строке, если они числа
// а те, которые не являются числом остаются собой
type GetLaunchParamsResponseString = {
  [key in keyof GetLaunchParamsResponse]: GetLaunchParamsResponse[key] extends number
    ? string
    : GetLaunchParamsResponse[key];
};

export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);

  let paramsObj;

  if (typeof Object.fromEntries === "function") {
    paramsObj = Object.fromEntries(
      params.entries()
    ) as unknown as GetLaunchParamsResponseString & { vk_profile_id: string };
  } else {
    paramsObj = fromEntries(
      params.entries()
    ) as unknown as GetLaunchParamsResponseString & { vk_profile_id: string };
  }

  return paramsObj;
};
