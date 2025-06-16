import React, { FC, useState } from "react";
import { Button, FormItem, ModalPage, Radio, Textarea } from "@vkontakte/vkui";
import ModalsPageHeader from "./ModalsPageHeader";
import { useReportAbuse } from "../../hooks/use-report-abuse";
import { useSnackbar } from "../../hooks/use-snackbar";

type ModalReportAbuseProps = {
  questionId: string;
  onClose: () => void;
  id: string;
};

export const ModalReportAbuse: FC<ModalReportAbuseProps> = ({
  questionId,
  onClose,
  id,
}) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [reasonText, setReasonText] = useState("inappropriateContent");
  const [isTryToSubmit, setIsTryToSubmit] = useState(false);
  const { reportAbuse, isLoading } = useReportAbuse();
  const showSnackbar = useSnackbar();

  // Валидация длины текста жалобы
  const isValidReportText = () => {
    const trimmedText = feedbackText.trim();

    return trimmedText.length > 0 && trimmedText.length <= 5000;
  };

  const onClickSubmit = async () => {
    setIsTryToSubmit(true);

    // Проверяем валидацию перед отправкой
    if (!isValidReportText()) {
      return;
    }

    try {
      await reportAbuse({
        questionId,
        reason: reasonText,
        text: feedbackText,
      });
      showSnackbar({
        text: "Жалоба успешно отправлена",
        variant: "success",
      });
      onClose();
    } catch (e) {
      showSnackbar({
        text: "Ошибка при отправке жалобы",
        variant: "error",
      });
    }
  };

  const getCharacterCountText = () => {
    const currentLength = feedbackText.trim().length;

    return `Символов: ${currentLength} / 5000`;
  };

  return (
    <ModalPage
      id={id}
      onClose={onClose}
      header={<ModalsPageHeader title="Пожаловаться" onClose={onClose} />}
    >
      <form>
        <FormItem top="Причина жалобы">
          <Radio
            name="reason"
            value="inappropriateContent"
            onChange={(e) => setReasonText(e.target.value)}
            defaultChecked
          >
            Неприемлемый контент
          </Radio>
          <Radio
            name="reason"
            value="hate"
            onChange={(e) => setReasonText(e.target.value)}
          >
            Враждебные высказывания
          </Radio>
          <Radio
            name="reason"
            value="spam"
            onChange={(e) => setReasonText(e.target.value)}
          >
            Спам
          </Radio>
          <Radio
            name="reason"
            value="other"
            onChange={(e) => setReasonText(e.target.value)}
          >
            Другое
          </Radio>
        </FormItem>

        <FormItem
          top="Опишите суть жалобы"
          status={!isTryToSubmit || isValidReportText() ? "default" : "error"}
          bottom={
            isTryToSubmit && !isValidReportText()
              ? "Текст жалобы не может превышать 5000 символов"
              : getCharacterCountText()
          }
        >
          <Textarea
            placeholder="Напишите комментарий"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </FormItem>

        <FormItem>
          <div className={"flex justify-end"}>
            <Button
              onClick={onClickSubmit}
              disabled={!feedbackText.trim() || isLoading}
              size="m"
            >
              Отправить
            </Button>
          </div>
        </FormItem>
      </form>
    </ModalPage>
  );
};
