import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ProfileBtnStore {
  isActive: boolean;
  vk_profile_id: string;
  setIsProfileBtnActive: (isActive: boolean) => void;
  toggleIsProfileBtnActive: () => void;
  setVkProfileId: (vk_profile_id: string) => void;
}

export const useProfileBtnStore = create<ProfileBtnStore>()(
  devtools(
    (set) => ({
      isActive: false,
      vk_profile_id: "",
      setIsProfileBtnActive: (isActive) =>
        set({ isActive }, false, "setIsProfileBtnActive"),
      toggleIsProfileBtnActive: () =>
        set(
          (state) => ({ isActive: !state.isActive }),
          false,
          "toggleIsProfileBtnActive"
        ),
      setVkProfileId: (vk_profile_id) => set({ vk_profile_id }),
    }),
    { name: "ProfileBtnStore" }
  )
);
