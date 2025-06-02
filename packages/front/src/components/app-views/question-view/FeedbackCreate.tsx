import React, { FC, useState } from "react";
import { Button, FormItem, Group, Spinner, Textarea } from "@vkontakte/vkui";
import { bridgeQuestionWallPost } from "../../../utils/bridge/bridge-question-wall-post";
import { useSnackbar } from "../../../hooks/use-snackbar";
import ym from "react-yandex-metrika";

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
  onSubmit?: (feedbackText: string) => Promise<void>;
  onCancel?: () => void;
}

const FeedbackCreate: FC<FeedbackCreateProps> = ({
  question = "",
  feedbackText: externalFeedbackText,
  setFeedbackText: setExternalFeedbackText,
  submitForm,
  onPostSuccess,
  questionImage,
  isLoading,
  feedbackUsers = [],
  onSubmit,
  onCancel,
}) => {
  const [localFeedbackText, setLocalFeedbackText] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const feedbackText =
    externalFeedbackText !== undefined
      ? externalFeedbackText
      : localFeedbackText;
  const setFeedbackText = setExternalFeedbackText || setLocalFeedbackText;

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
    ym("reachGoal", "send-answer");

    if (onSubmit) {
      await onSubmit(feedbackText);
      return;
    }

    if (!submitForm) return;

    try {
      setAnswerLoading(true);
      const { id } = await submitForm();
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

  return (
    <Group>
      <form onSubmit={onSubmitForm}>
        <FormItem>
          <Textarea
            name="feedback_message"
            value={feedbackText}
            placeholder={"Оставьте отзыв на вопрос..."}
            onChange={onChangeText}
            autoFocus
          />
        </FormItem>

        <FormItem>
          <div className={"flex justify-between gap-4"}>
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
          </div>
        </FormItem>
      </form>
    </Group>
  );
};

export default FeedbackCreate;
