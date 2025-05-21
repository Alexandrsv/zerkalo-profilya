import bridge from "@vkontakte/vk-bridge";

export const bridgeQuestionWallPost = async (questionId: string) => {
  const url = `https://vk.com/app51465205${encodeURI(
    "#/question/" + questionId
  )}`;
  return await bridge.send("VKWebAppShowWallPostBox", {
    message: `Есть вопрос по теме моего профиля.
Приглашаю ответить на него анонимно и честно`,
    attachments: url,
  });
};
