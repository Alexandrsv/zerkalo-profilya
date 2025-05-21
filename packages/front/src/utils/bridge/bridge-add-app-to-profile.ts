import bridge from "@vkontakte/vk-bridge";

export const bridgeAddAppToProfile = async () => {
  return (
    bridge
      .send("VKWebAppAddToProfile", {
        ttl: 0,
      })
      .then((data) => {
        return data;
      })
      .catch((error: any) => {
        console.error(error);

        return { error: error?.error_data?.error_code as number };
      })
  );
};
