import React, { ChangeEvent, FC, useState } from "react";
import {
  Button,
  ButtonGroup,
  Div,
  FormItem,
  FormLayout,
  Group,
  Textarea,
} from "@vkontakte/vkui";
import { useReportAbuse } from "../../hooks/use-report-abuse";
import ModalsPageHeader from "./ModalsPageHeader";
import { useSnackbar } from "../../hooks/use-snackbar";

const ModalReportAbuse: FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const { sendAbuse } = useReportAbuse();
  const showSnackbar = useSnackbar();

  const onChangeAbuseText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim().length;
    if (value > 3 && value < 5000) {
      setError("");
    }
    setText(e.currentTarget.value);
  };

  const onSubmit = async () => {
    if (text.trim().length <= 3) {
      setError("Слишком короткое сообщение");
      return;
    }
    if (text.trim().length > 5000) {
      setError("Слишком длинное сообщение");
      return;
    }
    await sendAbuse({
      text: text.trim(),
      successCb: (statusCode) => {
        onClose();
        if (statusCode === 200) {
          showSnackbar({ text: "Жалоба отправлена", variant: "success" });
        } else {
          showSnackbar({
            text: "Жалоба не отправлена\nПопробуйте позже",
            variant: "error",
          });
        }
      },
    });
  };

  return (
    <>
      <ModalsPageHeader onClose={onClose}>
        Сообщить о нарушении
      </ModalsPageHeader>

      <Group>
        <FormLayout className={""}>
          <FormItem
            top={"Опишите нарушение"}
            status={error ? "error" : "default"}
            bottom={error}
          >
            <Textarea
              placeholder={``}
              value={text}
              inputMode={"text"}
              onChange={onChangeAbuseText}
              className={"[&_textarea]:min-h-[100px]"}
            />
          </FormItem>
        </FormLayout>
        <Div>
          <ButtonGroup
            className={"flex justify-end pt-1 mb-10 w-full"}
            mode="horizontal"
            gap="m"
          >
            <Button onClick={onClose} appearance={"neutral"}>
              Отмена
            </Button>
            <Button onClick={onSubmit}>Отправить</Button>
          </ButtonGroup>
        </Div>
      </Group>
    </>
  );
};

export default ModalReportAbuse;
