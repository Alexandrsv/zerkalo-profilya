import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";

export const useUpdateLocation = (): void => {
  const location = useLocation();

  useEffect(() => {
    void bridge.send("VKWebAppSetLocation", {
      location: location.pathname + location.search,
      replace_state: true,
    });
  }, [location]);
};
