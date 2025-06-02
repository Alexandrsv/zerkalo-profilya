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
  scrollToComment,
  onSubmit,
  onClose,
  placeholder = "Введите комментарий...",
  buttonText = "Отправить",
  isLoading,
}: NewCommentProps) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (createComment && target) {
      await createComment(text, target);
      setText("");
      if (onClose) onClose();
    } else if (onSubmit) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormItem>
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
