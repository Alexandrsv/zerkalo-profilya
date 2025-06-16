import { useAppUser } from "./use-app-user";
import { useOpenAnswerStore } from "@/store/openAnswerStore";

/**
 * Хук для управления настройкой открытого ответа в фидбэке
 * - Для донов: сохраняет выбор в localStorage
 * - Для недонов: всегда возвращает анонимный режим
 */
export function useOpenAnswer(isDonUser?: boolean) {
  const { user } = useAppUser();
  const { isAnonymous, setIsAnonymous, toggleMode } = useOpenAnswerStore();

  const resolvedIsDonUser = isDonUser ?? user?.isDon ?? false;
  const isOpenAnswer = !isAnonymous && resolvedIsDonUser;

  return {
    isAnonymous,
    isOpenAnswer,
    isDonUser: resolvedIsDonUser,
    setIsAnonymous,
    toggleMode,
    getCurrentIsAnonymous: () => useOpenAnswerStore.getState().isAnonymous,
  };
}
