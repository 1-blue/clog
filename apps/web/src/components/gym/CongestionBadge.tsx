import React from "react";

import { cn } from "#web/libs/utils";

interface IProps {
  level: number; // 0~100
  size?: "sm" | "md";
}

const getStatus = (level: number) => {
  if (level < 30)
    return { label: "여유", color: "bg-secondary text-secondary-foreground" };
  if (level < 60)
    return { label: "보통", color: "bg-tertiary text-tertiary-foreground" };
  return { label: "혼잡", color: "bg-destructive text-destructive-foreground" };
};

const CongestionBadge: React.FC<IProps> = ({ level, size = "sm" }) => {
  const { label, color } = getStatus(level);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        color,
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
      )}
    >
      {label}
    </span>
  );
};
export default CongestionBadge;
