import React, { FC } from "react";

const Alien: FC<{ className?: string }> = ({ className }) => {
  return <span className={`animate-hue-rotate ${className}`}>👽</span>;
};

export default Alien;
