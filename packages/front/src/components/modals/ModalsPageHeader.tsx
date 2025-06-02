import React, { FC } from "react";
import {
  ModalPageHeader,
  PanelHeaderButton,
  useAdaptivity,
  ViewWidth,
  Platform,
  usePlatform,
} from "@vkontakte/vkui";
import { Icon24Cancel, Icon24Dismiss } from "@vkontakte/icons";

interface ModalsPageHeaderProps {
  title: string;
  onClose: VoidFunction;
}

const ModalsPageHeader: FC<ModalsPageHeaderProps> = ({ title, onClose }) => {
  const adaptivity = useAdaptivity();
  const isDesktop =
    adaptivity.viewWidth !== undefined &&
    adaptivity.viewWidth > ViewWidth.MOBILE;
  const platform = usePlatform();

  return (
    <ModalPageHeader
      before={
        platform === Platform.IOS && <PanelHeaderButton onClick={onClose} />
      }
      after={
        (platform === Platform.ANDROID || platform === Platform.VKCOM) && (
          <PanelHeaderButton onClick={onClose}>
            {platform === Platform.VKCOM ? <Icon24Cancel /> : <Icon24Dismiss />}
          </PanelHeaderButton>
        )
      }
    >
      {title}
    </ModalPageHeader>
  );
};

export default ModalsPageHeader;
