import React, { FC, HTMLProps } from "react";

export const UserInfoTag: FC<
  { text?: string | number | null } & HTMLProps<HTMLDivElement>
> = ({ text, className = "", ...props }) => {
  if (!text) {
    return null;
  }

  return (
    <div
      title={text.toString()}
      className={`mt-1
      bg-blue-500 text-white px-2 py-0.5 rounded-full 
      text-ellipsis overflow-hidden whitespace-nowrap
      ${className}`}
      {...props}
    >
      {text}
    </div>
  );
};
