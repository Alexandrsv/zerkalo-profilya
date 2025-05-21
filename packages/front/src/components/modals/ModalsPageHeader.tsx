import React, { FC, ReactNode } from "react";
import {
  ANDROID,
  IOS,
  ModalPageHeader,
  PanelHeaderButton,
  useAdaptivity,
  usePlatform,
  VKCOM,
} from "@vkontakte/vkui";
import { Icon24Cancel } from "@vkontakte/icons";

const ModalsPageHeader: FC<{ onClose: VoidFunction; children: ReactNode }> = ({
  onClose,
  children,
}) => {
  const platform = usePlatform();
  const adaptivity = useAdaptivity();
  const isDesktop = adaptivity.viewWidth > 2;
  return (
    <ModalPageHeader
      before={
        <>
          {(platform === ANDROID || platform === VKCOM) && !isDesktop && (
            <PanelHeaderButton onClick={onClose}>
              <Icon24Cancel />
            </PanelHeaderButton>
          )}
        </>
      }
      after={
        platform === IOS &&
        !isDesktop && (
          <PanelHeaderButton onClick={onClose}>
            <Icon24Cancel />
          </PanelHeaderButton>
        )
      }
    >
      {children}
    </ModalPageHeader>
  );
};

export default ModalsPageHeader;
