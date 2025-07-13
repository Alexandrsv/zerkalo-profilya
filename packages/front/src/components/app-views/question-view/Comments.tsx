import React, { FC, useEffect, useRef } from "react";
import { Button, ButtonGroup } from "@vkontakte/vkui";
import { UserInfoTag } from "../../user-info-tad/UserInfoTag";
import { sexNoun } from "@/const/sex";
import { getDeclensionWord } from "@/utils/get-declension-word";
import { Icon28ChevronDownOutline } from "@vkontakte/icons";
import { NewCommentForm } from "./NewCommentForm";
import { IComment } from "@/api/comment";
import { useFeedbackComments } from "@/hooks/use-feedback-comments";
import { useAppUser } from "@/hooks/use-app-user";
import { useSnackbar } from "@/hooks/use-snackbar";
import { ShowSnackbar } from "@/context/SnackbarContext";
import ym from "react-yandex-metrika";

export const CommentItem: FC<{
  comment: IComment;
  // eslint-disable-next-line
  addScrollCallback: (foo: Function, id: string) => void;
  deleteComment: (id: string) => Promise<IComment>;
  scrollToComment: (id?: string) => void;
  onResponse: (target: CommentTarget) => void;
  showSnackbar: ShowSnackbar;
}> = ({
  comment,
  deleteComment,
  addScrollCallback,
  onResponse,
  scrollToComment,
  showSnackbar,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = React.useState(false);

  useEffect(() => {
    if (commentRef.current) {
      addScrollCallback(() => {
        commentRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
        setHighlight(true);
      }, comment.id);
    }
  }, [addScrollCallback, comment.id]);

  useEffect(() => {
    if (highlight) {
      setTimeout(() => {
        setHighlight(false);
      }, 3000);
    }
  }, [highlight]);

  const onClickDelete = async () => {
    const deleteRez = await deleteComment(comment.id);

    if (deleteRez) {
      ym("reachGoal", "delete-comment");
      showSnackbar({ text: "Комментарий удален" });
    } else {
      showSnackbar({
        text: "Не удалось удалить комментарий",
        variant: "error",
      });
    }
  };

  return (
    <div
      ref={commentRef}
      className={`px-4 py-2 flex flex-col transition duration-1000 ${
        highlight && "bg-[#3A8DC2] bg-opacity-10"
      }`}
    >
      <div className={"flex text-sm"}>
        <span
          className={
            "text-txt-secondary inline-block self-center mt-1 pr-2 shrink-0"
          }
        >
          Автор:
        </span>
        <UserInfoTag
          text={comment?.author?.profession}
          className={"!text-txt-secondary !bg-transparent"}
        />
        <UserInfoTag
          text={sexNoun[comment.author?.sex]}
          className={"!text-txt-secondary !bg-transparent shrink-0"}
        />
        {!!comment?.author?.age && (
          <UserInfoTag
            text={getDeclensionWord(
              ["год", "года", "лет"],
              comment?.author?.age
            )}
            className={"!text-txt-secondary !bg-transparent shrink-0"}
          />
        )}
      </div>
      <div
        className={
          "text-sm text-txt-secondary flex items-baseline justify-between"
        }
      >
        {comment?.parentId ? (
          <button onClick={() => scrollToComment(comment.parentId)}>
            Ответ на комментарий
          </button>
        ) : (
          <div>Комментарий:</div>
        )}
      </div>
      <p className={"whitespace-pre-line py-1"}>{comment.text}</p>
      <div className={"flex justify-between"}>
        <button
          className={"text-sm text-txt-secondary !text-blue-500"}
          onClick={() => onResponse(["comment", comment.id])}
        >
          Ответить
        </button>
        <button
          className={"text-sm text-txt-secondary !text-blue-500"}
          onClick={onClickDelete}
        >
          Удалить
        </button>
        <div
          className={
            "text-txt-secondary text-sm text-right self-end pt-1 shrink-0"
          }
        >
          <div className={"flex space-x-2 flex-wrap"}>
            {new Date(comment.createdAt)
              .toLocaleString()
              .split(",")
              .map((s) => (
                <span key={s} className={"last:hidden ss:last:inline-block"}>
                  {s}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export type CommentTarget = ["feedback" | "comment", string];

const Comments: FC<{
  lastComment: IComment[];
  feedbackId: string;
  questionId: string;
}> = ({ feedbackId, questionId, lastComment }) => {
  const { user } = useAppUser();
  const [showComments, setShowComments] = React.useState(false);
  const { comments, createNewComment, deleteComment } = useFeedbackComments(
    showComments ? feedbackId : undefined
  );
  const responseRef = useRef<HTMLDivElement>(null);
  const [showNewCommentForm, setShowNewCommentForm] = React.useState(false);
  const [newCommentTarget, setNewCommentTarget] = React.useState<CommentTarget>(
    ["feedback", ""]
  );
  // eslint-disable-next-line @typescript-eslint/ban-types
  const scrollToCommentCallbacks = useRef<Record<string, Function>>({});
  const showSnackbar = useSnackbar();

  const scrollToResponse = () => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  };

  const scrollToComment = (id?: string) => {
    if (id) {
      try {
        scrollToCommentCallbacks.current[id]();
      } catch (e) {
        console.error("Failed to scroll to comment:", e);
      }
    }
  };

  const onResponse = (target: CommentTarget) => {
    if (target[0] === "comment") {
      setNewCommentTarget(target);
      setShowNewCommentForm(true);
      scrollToResponse();
    } else {
      if (!showNewCommentForm) {
        scrollToResponse();
      }
      setShowNewCommentForm((status) => !status);
    }
  };

  const onCloseForm = () => {
    setShowNewCommentForm(false);
    setNewCommentTarget(["feedback", ""]);
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  const addScrollCallback = (callback: Function, id: string) => {
    scrollToCommentCallbacks.current[id] = callback;
  };

  const onScroll = (id: string) => {
    if (!id || !scrollToCommentCallbacks.current[id]) return;
    scrollToCommentCallbacks.current[id]();
  };

  const onShowOrHideComments = async () => {
    setShowComments(!showComments);
  };

  async function createComment(text: string, target: CommentTarget) {
    if (user?.id) {
      const newComment = await createNewComment({
        text,
        parentId: target[0] === "comment" ? target[1] : undefined,
        feedbackId,
        questionId,
        authorId: user?.id,
      });

      if (newComment) {
        if (target[0] === "feedback") {
          if (target[0] === "feedback") {
            ym("reachGoal", "comment-to-feedback");
          } else {
            ym("reachGoal", "comment-to-comment");
          }
        }
      }

      if (!showComments && newComment) {
        setShowComments(true);
        setTimeout(() => {
          onScroll(newComment.id);
        }, 1000);
        showSnackbar({
          text: "Комментарий отправлен",
          variant: "success",
        });
      } else {
        if (!newComment) {
          showSnackbar({
            text: "Ошибка при отправке комментария",
            variant: "error",
          });
        } else {
          showSnackbar({
            text: "Комментарий отправлен",
            variant: "success",
          });
          setTimeout(() => {
            onScroll(newComment.id);
          }, 1000);
        }
      }
    }
  }

  return (
    <>
      <ButtonGroup className={"flex justify-center"}>
        {lastComment?.length > 0 && (
          <Button mode={"tertiary"} onClick={onShowOrHideComments}>
            {showComments ? "Скрыть" : "Показать комментарии"}
          </Button>
        )}
        {!showNewCommentForm && (
          <Button
            mode={"tertiary"}
            onClick={() => onResponse(["feedback", ""])}
          >
            Ответить
          </Button>
        )}

        {showComments &&
          lastComment &&
          lastComment.length > 0 &&
          lastComment[0]?.id &&
          comments &&
          comments?.length && (
            <Button
              mode={"tertiary"}
              onClick={() => onScroll(lastComment[0].id)}
            >
              <Icon28ChevronDownOutline />
            </Button>
          )}
      </ButtonGroup>
      {showComments && (
        <div className={"border-l border-l-4 "}>
          {comments &&
            comments.map((comment) => {
              return (
                <CommentItem
                  key={comment.id}
                  onResponse={onResponse}
                  comment={comment}
                  scrollToComment={scrollToComment}
                  addScrollCallback={addScrollCallback}
                  deleteComment={deleteComment}
                  showSnackbar={showSnackbar}
                />
              );
            })}
        </div>
      )}
      <div ref={responseRef}>
        {showNewCommentForm && (
          <NewCommentForm
            createComment={createComment}
            onClose={onCloseForm}
            target={newCommentTarget}
            scrollToComment={scrollToComment}
          />
        )}
      </div>
    </>
  );
};

export default Comments;
