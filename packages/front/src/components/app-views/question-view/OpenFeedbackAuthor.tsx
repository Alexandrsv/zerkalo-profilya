import React, { FC } from "react";
import { Avatar, Text, Div, Card } from "@vkontakte/vkui";
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
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              DON ⭐
            </span>
          )}
        </div>
        <Text className="text-xs text-gray-500">Открытый ответ</Text>
      </div>
    </Card>
  );
};

export default OpenFeedbackAuthor;
