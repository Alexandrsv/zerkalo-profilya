import React, { FC } from "react";
import { Counter } from "@vkontakte/vkui";

interface UnseenBannerNotificationProps {
  extraText?: string;
}

export const UnseenBannerNotification: FC<UnseenBannerNotificationProps> = ({
  extraText,
}) => {
  return (
    <Counter size="s" mode="primary">
      {extraText ? extraText : ""}
    </Counter>
  );
};
