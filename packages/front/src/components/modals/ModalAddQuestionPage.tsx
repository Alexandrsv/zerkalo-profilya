import React, { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Div,
  FormItem,
  Group,
  Separator,
  SimpleCell,
  Spinner,
  Switch,
  Textarea,
} from "@vkontakte/vkui";
import { IUser } from "../../api/user";
import { QuestionInput } from "../../api/questions";
import { useQuestionCreate } from "../../hooks/use-question-create";
import ExampleQuestionsList from "./ExampleQuestionsList";
import { Icon28QuestionOutline } from "@vkontakte/icons";
import ModalsPageHeader from "./ModalsPageHeader";
import { getAllowNotifications } from "../../utils/bridge/get-allow-notifications";
import { UpdateUser } from "../../hooks/use-app-user";
import { useSnackbar } from "../../hooks/use-snackbar";
import { bridgeAddAppToProfile } from "../../utils/bridge/bridge-add-app-to-profile";
import ym from "react-yandex-metrika";

const ModalAddQuestionPage: FC<{
  user?: IUser;
  onClose: () => void;
  updateUser: UpdateUser;
  variant?: "onboarding" | "modal";
}> = ({ user, updateUser, onClose, variant = "modal" }) => {
  const { createQuestion } = useQuestionCreate();
  const [targetUrl, setTargetUrl] = useState("...");
  const [questionText, setQuestionText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [showExample, setShowExample] = useState(false);
  const [isTryToSubmit, setIsTryToSubmit] = useState(false);
  const [isNotify, setIsNotify] = useState(true);
  const [isAddToProfile, setIsAddToProfile] = useState(true);
  const isModal = variant === "modal";
  const [isSendLoading, setIsSendLoading] = useState(false);
  const showSnackbar = useSnackbar();

  const isOnboarded = user?.flags.includes("IS_ONBOARDED") || false;

  useEffect(() => {
    if (user?.vkId) {
      setTargetUrl(`https://vk.com/id${user?.vkId}`);
    }
  }, [user?.vkId]);

  // const onChangeTargetUrl = (e: ChangeEvent<HTMLInputElement>) => {
  //   setTargetUrl(e.currentTarget.value);
  // };

  const onChangeQuestionText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionText(e.currentTarget.value);
  };

  const onChangeIsActive = (
    _e:
      | ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setIsActive((status) => !status);
  };

  const onChangeIsNotify = (
    _e:
      | ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setIsNotify((status) => !status);
  };

  const onChangeIsAddToProfile = (
    _e:
      | ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setIsAddToProfile((status) => !status);
  };

  const isValidQuestionText = () => {
    try {
      const text = questionText.replaceAll(/[^А-яA-z]/g, "").trim();

      return text.length >= 5 && questionText.trim().length <= 500;
    } catch (error) {
      console.error(error, {
        targetUrl,
        questionText,
        isActive,
        showExample,
        isTryToSubmit,
        isNotify,
        isSendLoading,
      });

      return false;
    }
  };

  const hasAllowNotify = user?.flags?.includes("IS_ALLOW_PUSH_NOTIFICATION");
  const hasAppBtnInProfile = user?.flags?.includes("IS_ADD_TO_PROFILE");

  const checkUrl = (url: string) => {
    if (!url.indexOf("https://vk.com") || !url.indexOf("https://m.vk.com")) {
      return "vk";
    }

    if (!url.indexOf("https://ok.ru") || !url.indexOf("https://m.ok.ru")) {
      return "ok";
    }

    return false;
  };

  const onSubmit = async () => {
    setIsSendLoading(true);
    setIsTryToSubmit(true);

    if (user?.vkId && checkUrl(targetUrl) && isValidQuestionText()) {
      const questionInput: QuestionInput = {
        authorId: user?.id.toString(),
        targetUrl,
        questionText: questionText.trim(),
        targetSex: "0",
        isActive,
      };
      const question = await createQuestion(questionInput);

      if (isAddToProfile && !hasAppBtnInProfile && isOnboarded) {
        const rez = await bridgeAddAppToProfile();

        if (!("error" in rez) || rez.error === 13) {
          ym("reachGoal", "new-question-add-app-to-profile");
          void (await updateUser({
            flags: [...user.flags, "IS_ADD_TO_PROFILE"],
          }));
        }
      }

      if (isNotify && !hasAllowNotify) {
        await getAllowNotifications(user, updateUser);
      }

      if (question) {
        showSnackbar({ text: "Вопрос добавлен" });
      }
      onClose();
    }
    setIsSendLoading(false);
  };

  const onToggleExample = () => {
    setShowExample(!showExample);
  };

  const onChoiceExample = (question: string) => {
    setQuestionText(question);
    onToggleExample();
  };

  return (
    <>
      {isModal && (
        <>
          <ModalsPageHeader title="Добавить вопрос" onClose={onClose} />
          <Separator />
        </>
      )}

      <Group>
        <div className={"relative"}>
          {showExample && (
            <ExampleQuestionsList
              onChoiceExample={onChoiceExample}
              onBack={onToggleExample}
              variant={variant}
            />
          )}
          {/*<FormItem*/}
          {/*  top={"Ссылка на ваш профиль"}*/}
          {/*  // status={!!checkUrl(targetUrl) ? "valid" : "error"}*/}
          {/*  // bottom={*/}
          {/*  //   !!checkUrl(targetUrl)*/}
          {/*  //     ? ""*/}
          {/*  //     : "Ссылка должна быть на профиль ВК или ОК (https://vk.com/***** или https://ok.ru/*****)"*/}
          {/*  // }*/}
          {/*>*/}
          {/*  <Input*/}
          {/*    type="text"*/}
          {/*    inputMode={"url"}*/}
          {/*    disabled*/}
          {/*    value={targetUrl}*/}
          {/*    onChange={onChangeTargetUrl}*/}
          {/*  />*/}
          {/*</FormItem>*/}
          <FormItem
            top={"Что хотите узнать?"}
            status={
              !isTryToSubmit || isValidQuestionText() ? "default" : "error"
            }
            bottom={
              !isTryToSubmit || isValidQuestionText()
                ? ""
                : "Напишите вопрос или выберите из примеров. От 5 до 500 букв."
            }
          >
            <Textarea
              placeholder={`Введите текст вопроса \nПример: "Какие эмоции вызывает профиль, почему?"`}
              value={questionText}
              inputMode={"text"}
              onChange={onChangeQuestionText}
              className={"[&_textarea]:min-h-[100px]"}
            />
          </FormItem>
          <Div>
            <Button
              onClick={onToggleExample}
              after={
                <Icon28QuestionOutline
                  style={{
                    animationIterationCount: "5",
                  }}
                  className={"animate-pulse"}
                  height={22}
                  width={22}
                />
              }
            >
              Примеры вопросов
            </Button>
          </Div>
          {variant === "modal" && (
            <SimpleCell
              Component="label"
              after={<Switch onChange={onChangeIsActive} checked={isActive} />}
            >
              Открыть вопрос для всех
            </SimpleCell>
          )}
          {!hasAllowNotify && (
            <SimpleCell
              Component="label"
              after={<Switch onChange={onChangeIsNotify} checked={isNotify} />}
            >
              Уведомлять об ответах на ваш вопрос
            </SimpleCell>
          )}
          {!hasAppBtnInProfile && isOnboarded && (
            <SimpleCell
              Component="label"
              after={
                <Switch
                  onChange={onChangeIsAddToProfile}
                  checked={isAddToProfile}
                />
              }
            >
              Добавить кнопку в профиль
            </SimpleCell>
          )}

          <Div className={"flex justify-end !mb-11"}>
            <ButtonGroup className={"pt-1"} mode="horizontal" gap="m">
              {variant === "modal" && (
                <Button onClick={onClose} appearance={"neutral"}>
                  Отмена
                </Button>
              )}
              <Button
                onClick={onSubmit}
                disabled={isSendLoading}
                after={isSendLoading && <Spinner size={"s"} />}
              >
                Добавить
              </Button>
            </ButtonGroup>
          </Div>
        </div>
      </Group>
    </>
  );
};

export default ModalAddQuestionPage;
