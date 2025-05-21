import React, { FC } from "react";
import { Text } from "@vkontakte/vkui";
import WhyGirl from "../../../assets/why-girl.svg";

const PromoBlock12: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={"relative pt-10 " + className}>
      <div className={"absolute top-0 left-0 flex items-center justify-center"}>
        <Text weight={"1"}>Почему парни не предлагают отношений?</Text>
      </div>
      <WhyGirl className={"stroke-blue-700 scale-75"} />
    </div>
  );
};

export default PromoBlock12;
