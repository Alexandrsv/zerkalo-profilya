import React from "react";
import { SimpleCell, Switch } from "@vkontakte/vkui";
import { useAppUser } from "../../hooks/use-app-user";
import { getAllowNotifications } from "../../utils/bridge/get-allow-notifications";

const NotificationCell = () => {
  const { user, updateUser } = useAppUser();

  const isAllowNotifications =
    user?.flags.includes("IS_ALLOW_PUSH_NOTIFICATION") || false;

  const onSwitch = async () => {
    if (user) {
      if (isAllowNotifications) {
        void (await updateUser({
          flags: [
            ...user.flags.filter(
              (flag) => flag !== "IS_ALLOW_PUSH_NOTIFICATION"
            ),
            "IS_CANCEL_PUSH_NOTIFICATION",
          ],
        }));
      } else {
        await getAllowNotifications(user, updateUser);
      }
    }
  };

  return (
    <SimpleCell
      Component="label"
      after={<Switch onChange={onSwitch} checked={isAllowNotifications} />}
    >
      Уведомлять об ответах
    </SimpleCell>
  );
};

export default NotificationCell;
