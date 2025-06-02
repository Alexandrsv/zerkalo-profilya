import bridge from "@vkontakte/vk-bridge";

interface VKWebAppAddToProfileParams {
  ttl: number;
}

interface VKWebAppAddToProfileResult {
  result: boolean;
}

interface VKBridgeError {
  error_data?: {
    error_code: number;
    error_reason: string;
  };
}

export const bridgeAddAppToProfile = async () => {
  return bridge
    .send("VKWebAppAddToProfile", {
      ttl: 0,
    })
    .then((data) => {
      return data;
    })
    .catch((error: VKBridgeError) => {
      console.error(error);

      return { error: error?.error_data?.error_code };
    });
};
