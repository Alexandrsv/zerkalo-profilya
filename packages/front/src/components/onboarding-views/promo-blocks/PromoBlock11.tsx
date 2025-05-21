import React, { FC } from "react";
import { Text } from "@vkontakte/vkui";
import Why1 from "../../../assets/why1.svg";

const PromoBlock11: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={"relative " + className}>
      <div className={"absolute top-0 left-0 flex items-center justify-center"}>
        <Text weight={"1"}>Как я выгляжу со стороны?</Text>
      </div>
      <Why1 className={"stroke-blue-700 scale-75"} />
    </div>
  );
};

export default PromoBlock11;
