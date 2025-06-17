import { Button, FormItem, Textarea } from "@vkontakte/vkui";
import React, { FormEvent, useState } from "react";
import { CommentTarget } from "./Comments";

export interface NewCommentProps {
  createComment?: (text: string, target: CommentTarget) => Promise<void>;
  target?: CommentTarget;
  scrollToComment?: (id?: string) => void;
  onSubmit?: (text: string) => void;
  onClose?: () => void;
  placeholder?: string;
  buttonText?: string;
  isLoading?: boolean;
}

export const NewCommentForm = ({
  createComment,
  target,
  scrollToComment: _scrollToComment,
  onSubmit,
  onClose,
  placeholder = "Введите комментарий...",
  buttonText = "Отправить",
  isLoading,
}: NewCommentProps) => {
  const [text, setText] = useState("");
  const [isTryToSubmit, setIsTryToSubmit] = useState(false);

  // Валидация длины текста комментария
  const isValidCommentText = () => {
    const trimmedText = text.trim();

    return trimmedText.length >= 5 && trimmedText.length <= 2000;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsTryToSubmit(true);

    // Проверяем валидацию перед отправкой
    if (!isValidCommentText()) {
      return;
    }

    if (createComment && target) {
      await createComment(text, target);
      setText("");
      setIsTryToSubmit(false);
      if (onClose) onClose();
    } else if (onSubmit) {
      onSubmit(text);
      setText("");
      setIsTryToSubmit(false);
    }
  };

  const getCharacterCountText = () => {
    const currentLength = text.trim().length;

    if (currentLength < 5) {
      return `Минимум 5 символов. Осталось: ${5 - currentLength}`;
    }

    return `Символов: ${currentLength} / 2000`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormItem
        status={!isTryToSubmit || isValidCommentText() ? "default" : "error"}
        bottom={
          isTryToSubmit && !isValidCommentText()
            ? "Комментарий должен содержать от 5 до 2000 символов"
            : getCharacterCountText()
        }
      >
        <Textarea
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </FormItem>
      <FormItem>
        <div className="flex items-center space-x-2 justify-end">
          {onClose && (
            <Button mode="secondary" onClick={onClose}>
              Отмена
            </Button>
          )}
          <Button
            disabled={!text.trim() || isLoading}
            type="submit"
            size="m"
            appearance="positive"
          >
            {buttonText}
          </Button>
        </div>
      </FormItem>
    </form>
  );
};
