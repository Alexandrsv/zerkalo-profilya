import { ILogin, loginFetcher } from "../api/user";
import useSWR from "swr";
import { useBridgeUser } from "./use-bridge-user";

export const useLogin = () => {
  const { bridgeUser } = useBridgeUser();

  let params: ILogin = {
    vkId: bridgeUser?.id || 0,
    name: (bridgeUser?.first_name || "") + " " + bridgeUser?.last_name || "",
    sex: bridgeUser?.sex?.toString() || "0",
    photo: bridgeUser?.photo_200 || "",
    isClosedProfile: bridgeUser?.is_closed || false,
  };

  if (bridgeUser?.bdate_visibility === 1 && bridgeUser.bdate) {
    const age =
      new Date(
        new Date().getTime() - new Date(bridgeUser.bdate).getTime()
      ).getFullYear() - 1970;
    params = { ...params, age };
  }

  return useSWR(
    bridgeUser?.id ? `/users/login` : null,
    () => loginFetcher(params),
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 4xx.
        if (error.status && error.status.toString()[0] === "4") return;
        if (retryCount >= 50) return;
        setTimeout(() => revalidate({ retryCount }), 2000);
      },
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );
};
