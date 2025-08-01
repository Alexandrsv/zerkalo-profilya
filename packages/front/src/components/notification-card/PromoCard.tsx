import React from "react";
import { Button, Card, Text } from "@vkontakte/vkui";

const PREMIUM_URL = "https://vk.com/donut/app_zerkalo";

const PromoCard: React.FC = () => {
  return (
    <Card className="p-4 pb-8 mb-6 shadow-lg rounded-xl bg-white/90 max-w-xl mx-auto">
      <Text weight="2" className="text-lg font-bold mb-2 text-center">
        Как работает "Зеркало"?
      </Text>
      <Text className="mb-4 text-center opacity-80">
        В приложении есть два режима. Выберите, какой подходит вам сейчас:
      </Text>
      <div className="mb-4">
        <Text weight="2" className="mb-1">
          1. РЕЖИМ УЧАСТНИКА <span className="opacity-60">(бесплатно)</span>
        </Text>
        <ul className="list-disc list-inside ml-2 mb-2">
          <li>
            <b>Принцип:</b> Чтобы получать, нужно отдавать.
          </li>
          <li>
            <b>Действие:</b> Отвечайте на вопросы других, чтобы ваш вопрос
            активнее показывался в ленте. Система автоматически поддерживает
            баланс: чем больше вы помогаете другим, тем чаще другие помогают
            вам.
          </li>
        </ul>
      </div>
      <div className="mb-4">
        <Text weight="2" className="mb-1">
          2. ПРЕМИУМ-ДОСТУП <span className="opacity-60">(250 ₽)</span>
        </Text>
        <ul className="list-disc list-inside ml-2 mb-2">
          <li>
            <b>Результат без усилий:</b> Ваш вопрос ставится в приоритетную
            очередь на 5 гарантированных ответов. Вам не нужно отвечать
            кому-либо.
          </li>
          <li>
            <b>Точный фильтр:</b> Узнайте мнение <b>только мужчин</b> или{" "}
            <b>только женщин</b>.
          </li>
        </ul>
        <Button
          size="l"
          mode="primary"
          stretched
          className="mt-2 mb-2"
          href={PREMIUM_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Перейти в Премиум-режим
        </Button>
      </div>
    </Card>
  );
};

export default PromoCard;
