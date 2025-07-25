import React, { FC, ReactNode } from "react";
import { Card, Link, Text } from "@vkontakte/vkui";
import { useAppUser } from "../../hooks/use-app-user";
import { useSnackbar } from "../../hooks/use-snackbar";
import { Link as DomLink } from "react-router-dom";
import { routes } from "../../routes";
import bridge from "@vkontakte/vk-bridge";

const Description: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <span className={"opacity-60 text-[.9em] " + className}>{children}</span>
  );
};

// TODO: отрефактори, жахни лишнее

const PromoCard = () => {
  const { user } = useAppUser();
  const showSnackbar = useSnackbar();

  const isClosedProfile = user?.isClosedProfile || false;

  // Unused variables and functions prefixed with underscore
  const _randomCard = Math.floor(Math.random() * 2);
  const _isAllowPushNotifications =
    user?.flags.includes("IS_ALLOW_PUSH_NOTIFICATION") || false;
  const _isAddToProfile = user?.flags.includes("IS_ADD_TO_PROFILE") || false;

  const _updateUser = () => {}; // Placeholder for unused updateUser

  const _onAllowPush = () => {}; // Placeholder for unused function

  const _goToFeed = () => {}; // Placeholder for unused function

  const _addAppToVkProfile = async () => {
    // eslint-disable-next-line no-console
    console.debug("addAppToVkProfile");
    showSnackbar({
      text: `Фича ждет модерации ВК`,
      variant: "success",
    });
    const rez = await bridge
      .send("VKWebAppAddToProfile", {
        ttl: 0,
      })
      .then((data) => {
        return data?.visibility;
      })
      .catch((error) => {
        // Ошибка
        return error;
      });

    if (rez) {
      showSnackbar({
        text: `Приложение добавлено в профиль`,
      });
    } else {
      showSnackbar({
        text: `Фича ждет модерации ВК`,
        variant: "error",
      });
    }
  };

  return (
    <>
      {/*{!isAllowPushNotifications && (*/}
      {/*  <Card className={"p-4"}>*/}
      {/*    <div className={"flex flex-col items-center justify-center gap-2"}>*/}
      {/*      <Text weight="1" className={""}>*/}
      {/*        Получайте уведомления об ответах на ваш вопрос*/}
      {/*      </Text>*/}
      {/*      <Button onClick={onAllowPush}>Уведомлять</Button>*/}
      {/*    </div>*/}
      {/*  </Card>*/}
      {/*)}*/}
      <Card className={"p-4"}>
        <Text weight={"1"} className={"pb-2"}>
          Как получить отзывы?
        </Text>
        <ul className={"[&_li]:my-2 list-inside list-disc "}>
          <li>
            Отвечать на{" "}
            <Link>
              <DomLink to={routes.feed}>вопросы других пользователей.</DomLink>
            </Link>
            <br />
            <Description>
              На 5 отправленных ответов приложение гарантирует как минимум один
              ответ для одного из твоих вопросов
            </Description>
          </li>
          <li>
            <Link href={"https://vk.com/donut/app_zerkalo"} target={"_blank"}>
              Донат
            </Link>
            , поддержка разработки приложения, 5 отзывов - 250 рублей
            <br />
            <Description>
              Я разрабатываю это приложение, чтобы каждый мог получить отзывы и
              стать лучше. Оно бесплатно. Если тебе нравится
              приложение, то поддержи разработку и получи отзывы о своем
              профиле. Также ты получишь возможность <b>выбирать пол</b> тех,
              кто даёт ответ
            </Description>
          </li>
          {isClosedProfile && (
            <li>
              <a
                href={"https://vk.com/settings?act=privacy"}
                target={"_blank"}
                className={"text-red-600 font-bold"}
                rel="noreferrer"
              >
                Открыть профиль
              </a>{" "}
              <br />
              <Description>
                Твой профиль ВК закрыт, люди не смогут его увидеть и оставить
                полезный отзыв
              </Description>
            </li>
          )}
        </ul>
        {/*<div className={"flex flex-col items-center justify-center gap-2"}>*/}

        {/*{true && (*/}
        {/*  <>*/}
        {/*    <Text weight="1" className={"pb-3"}>*/}
        {/*      На 5 отправленных ответов приложение гарантирует как минимум*/}
        {/*      один ответ для одного из твоих вопросов.*/}
        {/*    </Text>*/}
        {/*    <Button onClick={goToFeed}>Лента вопросов</Button>*/}
        {/*  </>*/}
        {/*)}*/}
        {/*</div>*/}
      </Card>
    </>
  );
};

export default PromoCard;
