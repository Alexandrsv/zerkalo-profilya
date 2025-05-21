import { Button, FormItem, FormLayout, Textarea } from "@vkontakte/vkui";
import React, { FC } from "react";
import { CommentTarget } from "./Comments";

const NewCommentForm: FC<{
  onClose: () => void;
  target: CommentTarget;
  scrollToComment: (id: string) => void;
  createComment: (text: string, target: CommentTarget) => void;
}> = ({ scrollToComment, onClose, target, createComment }) => {
  const [commentText, setCommentText] = React.useState("");
  const [isTryingToSubmit, setIsTryingToSubmit] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const checkCommentText = (text: string) => {
    const trimmedText = text.trim();

    if (trimmedText.replaceAll(/[^А-яA-z]/g, "").length < 5) {
      setError("Комментарий должен содержать не менее 5 букв");
      return false;
    }
    if (trimmedText.length > 2000) {
      setError("Комментарий должен быть не более 2000 символов");
      return false;
    }
    setError("");
    return true;
  };

  const onCommentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    checkCommentText(text);
    setCommentText(text);
  };

  const onScrollToComment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToComment(target[1]);
  };

  const onSubmit = () => {
    setIsTryingToSubmit(true);
    if (checkCommentText(commentText)) {
      setIsSending(true);
      createComment(commentText.trim(), target);
      setIsSending(false);
      onClose();
    }
  };

  return (
    <FormLayout className={"flex flex-col pt-8 "} onSubmit={onSubmit}>
      <FormItem
        className={"!px-0"}
        status={isTryingToSubmit && error.length ? "error" : "default"}
        top={
          <div>
            {target[0] === "comment" ? (
              <button onClick={onScrollToComment}>
                Ответить на комментарий
              </button>
            ) : (
              "Коммент к ответу"
            )}
          </div>
        }
        bottom={isTryingToSubmit && error}
      >
        <Textarea
          placeholder={"Введите комментарий"}
          onChange={onCommentTextChange}
          value={commentText}
        />
      </FormItem>
      <FormItem className={"!flex justify-end space-x-4 !px-0"}>
        <Button size="s" className={""} mode={"secondary"} onClick={onClose}>
          Отмена
        </Button>
        <Button size="s" className={""} onClick={onSubmit} disabled={isSending}>
          Отправить
        </Button>
      </FormItem>
    </FormLayout>
  );
};

export default NewCommentForm;
