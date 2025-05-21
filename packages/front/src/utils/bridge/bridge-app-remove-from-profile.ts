import bridge from "@vkontakte/vk-bridge";

export const bridgeAppRemoveFromProfile = async () => {
  return (
    bridge
      // @ts-ignore
      .send("VKWebAppRemoveFromProfile")
      .then((data) => {
        return data as { result: boolean; error: 0 };
      })
      .catch((error: any) => {
        console.error(error);
        return { error: error.error_data.error_code as number };
      })
  );
};
