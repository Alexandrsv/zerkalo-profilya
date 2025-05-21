import React from "react";
import { SimpleCell, Switch } from "@vkontakte/vkui";
import { useAppUser } from "../../hooks/use-app-user";
import { bridgeAddAppToProfile } from "../../utils/bridge/bridge-add-app-to-profile";
import { bridgeAppRemoveFromProfile } from "../../utils/bridge/bridge-app-remove-from-profile";
import ym from "react-yandex-metrika";

const AddToProfileCell = () => {
  const { user, updateUser } = useAppUser();

  const isAddToProfile = user?.flags.includes("IS_ADD_TO_PROFILE") || false;

  const onSwitch = async () => {
    if (user) {
      if (isAddToProfile) {
        const removeRez = await bridgeAppRemoveFromProfile();
        if (!removeRez?.error) {
          ym("reachGoal", "app-remove-from-profile-settings");
          void (await updateUser({
            flags: user.flags.filter((flag) => flag !== "IS_ADD_TO_PROFILE"),
          }));
        }
      } else {
        const rez = await bridgeAddAppToProfile();
        if (!("error" in rez) || rez.error === 13) {
          ym("reachGoal", "add-app-to-profile-settings");
          void (await updateUser({
            flags: [...user.flags, "IS_ADD_TO_PROFILE"],
          }));
        }
      }
    }
  };

  return (
    <SimpleCell
      Component="label"
      after={<Switch onChange={onSwitch} checked={isAddToProfile} />}
    >
      Добавить в профиль
    </SimpleCell>
  );
};

export default AddToProfileCell;
