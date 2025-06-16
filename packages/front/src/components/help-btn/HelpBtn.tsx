import React, { useEffect, useState } from "react";
import { IconButton } from "@vkontakte/vkui";
import { Icon56CancelCircleOutline, Icon56HelpOutline } from "@vkontakte/icons";
import { usePortal } from "../../hooks/use-portal";

const HelpBtn = () => {
  const portal = usePortal();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {}, []);

  const onOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {portal(
        <div
          className={`fixed z-50 bottom-20 left-4 text-white text-l
          `}
        >
          <div
            className={`flex flex-col gap-1 absolute ease-in duration-300 -top-[110px] ${
              isOpen ? " -right-44 " : " right-96 "
            }
            justify-end items-start
            [&_a]:w-max
            [&_a]:rounded-lg
            [&_a]:text-left
            [&_a]:px-2 [&_a]:py-1 
            [&_a]:bg-gradient-to-r from-[#FC02FD] to-[#3A8DC2]
            `}
          >
            <a
              href={"https://vk.me/app_zerkalo"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              Помощь
            </a>
            <a
              href={"https://vk.me/app_zerkalo"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              Предложить функционал
            </a>
            <a
              href={"https://vk.me/app_zerkalo"}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              Связаться с разработчиком
            </a>
          </div>
          <IconButton
            onClick={onOpen}
            className={"animate-[hue-rotate_60s_infinite_linear] duration-75"}
          >
            {isOpen ? (
              <Icon56CancelCircleOutline
                className={
                  "bg-gradient-to-r from-[#FC02FD]/20 to-[#3A8DC2]/20 text-[#3A8DC2] rounded-full"
                }
              />
            ) : (
              <Icon56HelpOutline
                className={
                  "bg-gradient-to-r from-[#FC02FD]/20 to-[#3A8DC2]/20 text-[#3A8DC2] rounded-full"
                }
              />
            )}
          </IconButton>
        </div>
      )}
    </>
  );
};

export default HelpBtn;
