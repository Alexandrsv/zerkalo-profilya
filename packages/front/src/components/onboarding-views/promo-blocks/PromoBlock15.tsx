import React, { FC } from "react";
import { Text } from "@vkontakte/vkui";
import WhyResearch from "../../../assets/why-ignor.svg";

const PromoBlock15: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={"relative pt-9 " + className}>
      <div className={"absolute top-0 left-0 flex items-center justify-center"}>
        <Text weight={"1"}>Хочу исследовать аудиторию</Text>
      </div>
      <div className={"relative"}>
        <WhyResearch className={"stroke-blue-700 scale-75 scale-y-90"} />
        <img
          className={"absolute top-4 left-11 h-6 dark:invert "}
          src="/img/glasses.png"
          alt="glasses"
        />
      </div>
    </div>
  );
};

export default PromoBlock15;
