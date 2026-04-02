"use client";

import { Lightbulb, Rocket } from "lucide-react";

import { cn } from "#web/libs/utils";

interface IProps {
  variant: "primary" | "tertiary";
  message: string;
}

const InsightCard: React.FC<IProps> = ({ variant, message }) => {
  const Icon = variant === "primary" ? Rocket : Lightbulb;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-2xl border-l-4 p-5",
        variant === "primary" &&
          "border-primary bg-primary/5 text-on-surface",
        variant === "tertiary" &&
          "border-tertiary bg-tertiary/5 text-on-surface",
      )}
    >
      <Icon
        className={cn(
          "size-6 shrink-0",
          variant === "primary" && "text-primary",
          variant === "tertiary" && "text-tertiary",
        )}
        strokeWidth={2}
        aria-hidden
      />
      <p className="text-sm leading-relaxed font-medium">{message}</p>
    </div>
  );
};

export default InsightCard;
