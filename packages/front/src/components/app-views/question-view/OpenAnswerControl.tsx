import React, { FC } from "react";
import { Button, Card, Checkbox, Text, FormItem } from "@vkontakte/vkui";
import { useOpenAnswer } from "@/hooks/use-open-answer";
import ym from "react-yandex-metrika";

interface OpenAnswerControlProps {
  disabled?: boolean;
}

const OpenAnswerControl: FC<OpenAnswerControlProps> = ({
  disabled = false,
}) => {
  const { isOpenAnswer, isDonUser, toggleMode } = useOpenAnswer();

  const onTryToDon = () => {
    ym("reachGoal", "try-to-don-from-open-answer");
    window.open("https://vk.com/donut/app_zerkalo", "_blank");
  };

  return (
    <>
      <FormItem>
        <Checkbox
          checked={isOpenAnswer}
          onChange={toggleMode}
          disabled={disabled}
          className={"select-none"}
        >
          Открытый ответ (показать мой профиль)
        </Checkbox>
        <Text className="text-xs text-gray-500 mt-1">
          Автор вопроса увидит ваш профиль и сможет ответить вам лично
        </Text>
      </FormItem>
      {!isDonUser && isOpenAnswer && (
        <Card className="mx-4 p-4">
          <Text className="mb-2">
            <strong>Открытый ответ</strong> — функционал доступен только для
            тех, кто поддерживает приложение через VK DON
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            Автор вопроса сможет увидеть ваш профиль и ответить вам лично
          </Text>
          <Button
            className="!mt-4"
            onClick={onTryToDon}
            after={<div className="border-l-2 pl-2">250 ₽</div>}
          >
            Поддержать
          </Button>
        </Card>
      )}
    </>
  );
};

export default OpenAnswerControl;
