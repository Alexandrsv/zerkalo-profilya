import bridge from "@vkontakte/vk-bridge";

interface VKWebAppRemoveFromProfileResult {
  result: boolean;
}

interface VKBridgeError {
  error_data: {
    error_code: number;
    error_reason: string;
  };
}

export const bridgeAppRemoveFromProfile = async () => {
  try {
    // @ts-expect-error VKWebAppRemoveFromProfile не определен в типах vk-bridge
    const data = await bridge.send("VKWebAppRemoveFromProfile");

    return data as VKWebAppRemoveFromProfileResult;
  } catch (error) {
    console.error(error);
    const bridgeError = error as VKBridgeError;

    return { error: bridgeError.error_data.error_code };
  }
};
