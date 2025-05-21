import React, { FC } from "react";
import { Icon24ReportOutline } from "@vkontakte/icons";

const AbuseBtn: FC<{
  onCLick: () => void;
  size?: number;
  className?: string;
}> = ({ onCLick, size = 20, className }) => {
  return (
    <button onClick={onCLick} className={className}>
      <Icon24ReportOutline
        fill={"var(--vkui--color_accent_gray)"}
        title={"Пожаловаться"}
        height={size}
        width={size}
      />
    </button>
  );
};

export default AbuseBtn;
