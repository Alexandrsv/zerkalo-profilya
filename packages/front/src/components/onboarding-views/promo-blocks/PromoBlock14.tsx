import React, { FC } from "react";
import { Text } from "@vkontakte/vkui";
import Why2 from "../../../assets/why2.svg";

const PromoBlock14: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={"relative pt-10 " + className}>
      <div className={"absolute top-0 left-0 flex items-center justify-center"}>
        <Text weight={"1"}>Моя страничка интересная?</Text>
      </div>
      <Why2 className={"stroke-blue-700 scale-75"} />
    </div>
  );
};

export default PromoBlock14;
