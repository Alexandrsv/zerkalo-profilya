// import { checkDonutSubscription } from "../../api/vk-api";
import { getUserByVkId, patchUser } from "./user.service";

/**
 * Синхронизирует статус isDon пользователя с актуальным статусом подписки VK DON
 * @param vkId - VK ID пользователя
 * @returns обновленный статус isDon
 */
export async function syncUserDonStatus(
  vkId: string | number
): Promise<boolean> {
  try {
    console.log(`[DON SERVICE] Syncing DON status for user ${vkId}`);

    // Получаем пользователя из базы
    const user = await getUserByVkId(vkId.toString());
    if (!user) {
      console.log(`[DON SERVICE] User ${vkId} not found`);
      return false;
    }

    // Проверяем актуальный статус подписки через VK API
    // const actualDonStatus = await checkDonutSubscription(vkId);

    // // Если статус в БД не соответствует актуальному, обновляем
    // if (user.isDon !== actualDonStatus) {
    //   console.log(
    //     `[DON SERVICE] Updating isDon status for user ${vkId}: ${user.isDon} -> ${actualDonStatus}`
    //   );

    //   await patchUser(user.id, {
    //     isDon: actualDonStatus,
    //   });
    // } else {
    //   console.log(
    //     `[DON SERVICE] DON status for user ${vkId} is already synced: ${actualDonStatus}`
    //   );
    // }

    return user.isDon;
  } catch (error) {
    console.error(
      `[DON SERVICE] Error syncing DON status for user ${vkId}:`,
      error
    );
    return false;
  }
}

/**
 * Синхронизирует статус isDon для всех активных пользователей с подпиской
 * Используется для периодической синхронизации
 */
export async function syncAllDonStatuses(): Promise<void> {
  try {
    // Здесь можно добавить логику массовой синхронизации
    // Например, получить всех пользователей с isDon = true
    // и проверить их актуальный статус
    console.log("[DON SERVICE] Mass sync not implemented yet");
  } catch (error) {
    console.error("[DON SERVICE] Error in mass sync:", error);
  }
}
