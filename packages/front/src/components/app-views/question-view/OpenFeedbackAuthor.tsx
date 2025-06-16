import React, { FC } from "react";
import { Avatar, Text, Card } from "@vkontakte/vkui";
import { IUser } from "@/api/user";

interface OpenFeedbackAuthorProps {
  author: Pick<IUser, "id" | "vkId" | "name" | "photo" | "isDon">;
  className?: string;
}

const OpenFeedbackAuthor: FC<OpenFeedbackAuthorProps> = ({
  author,
  className = "",
}) => {
  const handleProfileClick = () => {
    if (author.vkId) {
      window.open(`https://vk.com/id${author.vkId}`, "_blank");
    }
  };

  const onClickToDon = () => {
    window.open("https://vk.com/donut/app_zerkalo", "_blank");
  };

  return (
    <Card
      className={
        "!flex items-center gap-3 p-3 !border-0 rounded-lg border " + className
      }
      mode={"tint"}
    >
      <Avatar
        src={author.photo}
        size={40}
        onClick={handleProfileClick}
        style={{ cursor: "pointer" }}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Text
            weight="3"
            className="cursor-pointer hover:text-blue-600"
            onClick={handleProfileClick}
          >
            {author.name}
          </Text>
          {author.isDon && (
            <button
              onClick={onClickToDon}
              className="ml-auto flex text-xs border-2 border-yellow-200 text-yellow-600 px-2 py-1 rounded-full"
            >
              DON ⭐
            </button>
          )}
        </div>
        <Text className="text-xs text-gray-500">Открытый ответ</Text>
      </div>
    </Card>
  );
};

export default OpenFeedbackAuthor;
