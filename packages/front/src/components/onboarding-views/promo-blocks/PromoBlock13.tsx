import React, { FC } from "react";
import { Text } from "@vkontakte/vkui";
import WhyIgnor from "../../../assets/why-ignor.svg";

const PromoBlock12: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={"relative pt-5 " + className}>
      <div className={"absolute top-0 left-0 flex items-center justify-center"}>
        <Text weight={"1"}>Почему меня игнорят?</Text>
      </div>
      <div>
        <WhyIgnor className={"stroke-blue-200 dark:stroke-blue-900 scale-75"} />
      </div>
    </div>
  );
};

export default PromoBlock12;
