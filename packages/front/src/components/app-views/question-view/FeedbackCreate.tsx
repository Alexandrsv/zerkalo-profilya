import React, { FC, useState } from "react";
import { Button, FormItem, Group, Spinner, Textarea } from "@vkontakte/vkui";
import { bridgeQuestionWallPost } from "@/utils/bridge/bridge-question-wall-post";
import { useSnackbar } from "@/hooks/use-snackbar";
import ym from "react-yandex-metrika";
import OpenAnswerControl from "./OpenAnswerControl";
import { useOpenAnswer } from "@/hooks/use-open-answer";

interface FeedbackCreateProps {
  feedbackText?: string;
  setFeedbackText?: (text: string) => void;
  question?: string;
  questionImage?: string | null;
  questionId?: string;
  feedbackUsers?: { id: number; name: string }[];
  onPostSuccess?: () => void;
  isLoading?: boolean;
  submitForm?: () => Promise<{ id: string; title: string }>;
  onSubmit?: (feedbackText: string, isAnonymous?: boolean) => Promise<void>;
  onCancel?: () => void;
}

const FeedbackCreate: FC<FeedbackCreateProps> = ({
  question = "",
  feedbackText: externalFeedbackText,
  setFeedbackText: setExternalFeedbackText,
  submitForm,
  onPostSuccess,
  questionImage: _questionImage,
  isLoading,
  feedbackUsers = [],
  onSubmit,
  onCancel,
}) => {
  const [localFeedbackText, setLocalFeedbackText] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [isTryToSubmit, setIsTryToSubmit] = useState(false);
  const showSnackbar = useSnackbar();
  const { getCurrentIsAnonymous } = useOpenAnswer();

  const feedbackText =
    externalFeedbackText !== undefined
      ? externalFeedbackText
      : localFeedbackText;
  const setFeedbackText = setExternalFeedbackText || setLocalFeedbackText;

  // Валидация длины текста фидбэка
  const isValidFeedbackText = () => {
    const trimmedText = feedbackText.trim();

    return trimmedText.length >= 30 && trimmedText.length <= 3000;
  };

  const onChangeText = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setFeedbackText(e.currentTarget.value);
  };

  const onWallPostClick = async () => {
    ym("reachGoal", "feedback_publish");
    setPostLoading(true);

    try {
      const publish = await bridgeQuestionWallPost({
        message: `Мой отзыв:\n"${feedbackText}"\n\nМне задали вопрос:\n"${question}"`,
        feedbackUsers,
      });

      if (publish) {
        showSnackbar({
          text: `Опубликовано на стену`,
          variant: "success",
        });
      } else {
        showSnackbar({
          text: `Ошибка публикации на стену`,
          variant: "error",
        });
      }
    } catch (e) {
      showSnackbar({
        text: `Ошибка публикации на стену`,
        variant: "error",
      });
    } finally {
      setPostLoading(false);
    }
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTryToSubmit(true);

    // Проверяем валидацию перед отправкой
    if (!isValidFeedbackText()) {
      return;
    }

    ym("reachGoal", "send-answer");

    if (onSubmit) {
      // Получаем актуальное значение в момент отправки
      const currentIsAnonymous = getCurrentIsAnonymous();
      await onSubmit(feedbackText, currentIsAnonymous);

      return;
    }

    if (!submitForm) return;

    try {
      setAnswerLoading(true);
      const { id: _id } = await submitForm();
      showSnackbar({
        text: "Ваш отзыв опубликован!",
        variant: "success",
      });
      onPostSuccess?.();
    } catch (e) {
      showSnackbar({
        text: "Ошибка при публикации отзыва",
        variant: "error",
      });
    } finally {
      setAnswerLoading(false);
    }
  };

  const getCharacterCountText = () => {
    const currentLength = feedbackText.trim().length;

    if (currentLength < 30) {
      return `Минимум 30 символов. Осталось: ${30 - currentLength}`;
    }

    return `Символов: ${currentLength} / 3000`;
  };

  return (
    <Group>
      <form onSubmit={onSubmitForm}>
        <FormItem
          status={!isTryToSubmit || isValidFeedbackText() ? "default" : "error"}
          bottom={
            isTryToSubmit && !isValidFeedbackText()
              ? "Отзыв должен содержать от 30 до 3000 символов"
              : getCharacterCountText()
          }
        >
          <Textarea
            name="feedback_message"
            value={feedbackText}
            placeholder={"Оставьте отзыв на вопрос..."}
            onChange={onChangeText}
            autoFocus
          />
        </FormItem>

        <OpenAnswerControl disabled={isLoading || answerLoading} />

        <FormItem>
          <div className={"flex justify-between gap-4"}>
            {onCancel && (
              <Button
                onClick={onCancel}
                disabled={isLoading || answerLoading}
                stretched
                size="m"
                mode="secondary"
              >
                Отмена
              </Button>
            )}
            <Button
              type="submit"
              onClick={onSubmitForm}
              disabled={isLoading || answerLoading || !feedbackText.trim()}
              stretched
              size="m"
              mode="primary"
              after={answerLoading ? <Spinner size="s" /> : undefined}
            >
              Отправить отзыв
            </Button>
            {submitForm && (
              <Button
                onClick={onWallPostClick}
                disabled={
                  isLoading ||
                  !feedbackText.trim() ||
                  postLoading ||
                  answerLoading
                }
                stretched
                size="m"
                mode="secondary"
                after={postLoading ? <Spinner size="s" /> : undefined}
              >
                Опубликовать
              </Button>
            )}
          </div>
        </FormItem>
      </form>
    </Group>
  );
};

export default FeedbackCreate;
