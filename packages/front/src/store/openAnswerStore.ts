import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface OpenAnswerStore {
  isAnonymous: boolean;
  setIsAnonymous: (isAnonymous: boolean) => void;
  toggleMode: () => void;
}

export const useOpenAnswerStore = create<OpenAnswerStore>()(
  devtools(
    persist(
      (set) => ({
        isAnonymous: false,
        setIsAnonymous: (isAnonymous: boolean) =>
          set({ isAnonymous }, false, "setIsAnonymous"),
        toggleMode: () =>
          set(
            (state) => ({ isAnonymous: !state.isAnonymous }),
            false,
            "toggleMode"
          ),
      }),
      {
        name: "open-answer-storage",
        version: 1,
      }
    ),
    { name: "OpenAnswerStore" }
  )
);
