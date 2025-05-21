import React, { FC } from "react";
import { Text } from "@vkontakte/vkui";
import Exchange from "../../../assets/exchange.svg";

const PromoText: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={
        "absolute flex text-red-500 items-center justify-center " + className
      }
    >
      <Text weight={"3"} className={"!text-xs"}>
        Мне понравилось *** <br /> Не понравилось ***
      </Text>
    </div>
  );
};

const PromoBlock14: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={"relative " + className}>
      <PromoText className={"-top-1 right-8 "} />
      <PromoText className={"top-10 left-5"} />
      <PromoText className={"top-36 left-36"} />
      <Exchange className={"stroke-indigo-500 pb-10 pt-5"} height={"300"} />
    </div>
  );
};

export default PromoBlock14;
