import bridge from "@vkontakte/vk-bridge";

interface BridgeQuestionWallPostParams {
  message: string;
  feedbackUsers: { id: number; name: string }[];
}

export const bridgeQuestionWallPost = async (
  params: BridgeQuestionWallPostParams | string
) => {
  if (typeof params === "string") {
    // Это ID вопроса
    const questionId = params;
    const url = `https://vk.com/app51465205${encodeURI(
      "#/question/" + questionId
    )}`;
    return await bridge.send("VKWebAppShowWallPostBox", {
      message: `Есть вопрос по теме моего профиля.
Приглашаю ответить на него анонимно и честно`,
      attachments: url,
    });
  }

  // Это объект с сообщением и пользователями
  return await bridge.send("VKWebAppShowWallPostBox", {
    message: params.message,
  });
};
