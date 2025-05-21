import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ActivityStore {
  isWriteText: boolean;
  setIsWriteText: (isWriteText: boolean) => void;
}

export const useActivityStore = create<ActivityStore>()(
  devtools(
    (set) => ({
      isWriteText: false,
      setIsWriteText: (isWriteText: boolean) => set(() => ({ isWriteText })),
    }),
    { name: "ActivityStore" }
  )
);
