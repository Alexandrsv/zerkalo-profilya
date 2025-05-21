import {
  Button,
  FormItem,
  FormItemProps,
  FormLayout,
  Textarea,
  Text,
  Spinner,
} from "@vkontakte/vkui";
import React, { FC, FormEventHandler, useState } from "react";
import { useActivityStore } from "../../../store/activityStore";

const ErrorText: FC<{ minLength: number; maxLength: number; text: string }> = ({
  minLength,
  text,
  maxLength,
}) => {
  return (
    <div className={""}>
      Текст ответа должен быть не менее {minLength} букв и не более {maxLength}
      {text.trim().length < maxLength && (
        <Text className={"!text-xs"}>
          <b>Ваше мнение важно</b>, пожалуйста, дайте развернутый ответ
        </Text>
      )}
    </div>
  );
};

const FeedbackCreate: FC<{
  onCancel: VoidFunction;
  isLoading: boolean;
  onSubmit: (text: string) => void;
}> = ({ onCancel, onSubmit, isLoading }) => {
  const MIN_LENGTH = 30;
  const MAX_LENGTH = 3000;
  const [feedbackText, setFeedbackText] = useState("");
  const [isClickSend, setIsClickSend] = useState(false);

  const setIsWriteText = useActivityStore((state) => state.setIsWriteText);

  const textLettersOnly = feedbackText
    ? feedbackText?.replaceAll(/[^А-яA-z]/g, "").trim()
    : "";

  const errorStatus =
    textLettersOnly.length < MIN_LENGTH || feedbackText.trim().length >= 3000
      ? "error"
      : "default";
  const textareaStatus: FormItemProps["status"] = isClickSend
    ? errorStatus
    : "default";

  const onChangeFeedbackText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackText(e.target.value);
  };

  const onClickSubmit: FormEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    setIsClickSend(true);
    if (errorStatus === "default") {
      onSubmit(feedbackText.trim());
    }
  };

  return (
    <FormLayout onSubmit={onClickSubmit}>
      <FormItem
        status={textareaStatus}
        bottom={
          textareaStatus === "error" ? (
            <ErrorText
              minLength={MIN_LENGTH}
              maxLength={MAX_LENGTH}
              text={feedbackText}
            />
          ) : undefined
        }
        className={"whitespace-pre-wrap"}
      >
        <Textarea
          placeholder={"Напишите развернутый ответ на вопрос"}
          value={feedbackText}
          onFocus={() => setIsWriteText(true)}
          onBlur={() => setIsWriteText(false)}
          onChange={onChangeFeedbackText}
          autoFocus
          className={"[&_textarea]:min-h-[150px]"}
        />
      </FormItem>
      <FormItem>
        <div className={"flex justify-end space-x-3"}>
          <Button size="l" mode={"secondary"} onClick={onCancel}>
            Отмена
          </Button>
          <Button
            size="l"
            onClick={onClickSubmit}
            disabled={isLoading}
            after={isLoading ? <Spinner size={"small"} /> : undefined}
          >
            Отправить
          </Button>
        </div>
      </FormItem>
    </FormLayout>
  );
};

export default FeedbackCreate;
