import { Div } from "@vkontakte/vkui";
import React, { FC, ReactNode } from "react";

const OnboardingContentWrapper: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Div className={"grow flex flex-col rounded-b-xl  bg-content-bg"}>
      {children}
    </Div>
  );
};

export default OnboardingContentWrapper;
