import React from "react";

import { Badge } from "#web/components/ui/badge";
import { cn } from "#web/libs/utils";

interface IProps {
  visitorCount: number;
  size?: "sm" | "md";
}

const getStatus = (visitorCount: number) => {
  if (visitorCount < 30) {
    return { label: "여유", color: "secondary" as const };
  }
  if (visitorCount < 60) {
    return { label: "보통", color: "tertiary" as const };
  }

  return { label: "혼잡", color: "destructive" as const };
};

const CongestionBadge: React.FC<IProps> = ({ visitorCount, size = "sm" }) => {
  const { label, color } = getStatus(visitorCount);

  return (
    <Badge
      variant={color === "destructive" ? "destructive" : "outline"}
      color={color === "destructive" ? undefined : color}
      className={cn(
        "font-bold",
        size === "sm" ? "h-5 px-1.5 text-[10px]" : "h-6 px-2 text-xs",
      )}
    >
      {label}
    </Badge>
  );
};
export default CongestionBadge;
