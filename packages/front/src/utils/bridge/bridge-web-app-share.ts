import bridge from "@vkontakte/vk-bridge";

interface VKBridgeError {
  error_data: {
    error_code: number;
    error_reason: string;
  };
}

export const bridgeWebAppShare = async (link: string) => {
  try {
    return await bridge.send("VKWebAppShare", {
      link,
    });
  } catch (error) {
    console.error(error);
    const bridgeError = error as VKBridgeError;
    return { error: bridgeError.error_data.error_code };
  }
};
