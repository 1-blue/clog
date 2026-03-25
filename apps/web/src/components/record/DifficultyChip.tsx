import React from "react";

import { difficultyToKoreanMap, type Difficulty } from "@clog/utils";

import { cn } from "#web/libs/utils";

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  VB: "bg-sky-900/30 text-sky-400",
  V0: "bg-red-900/30 text-red-400",
  V1: "bg-orange-900/30 text-orange-400",
  V2: "bg-yellow-900/30 text-yellow-400",
  V3: "bg-lime-900/30 text-lime-400",
  V4: "bg-green-900/30 text-green-400",
  V5: "bg-blue-900/30 text-blue-400",
  V6: "bg-indigo-900/30 text-indigo-400",
  V7: "bg-purple-900/30 text-purple-400",
  V8: "bg-pink-900/30 text-pink-400",
  V9: "bg-neutral-300/20 text-neutral-200",
  V10: "bg-neutral-900/50 text-neutral-100",
  V_PLUS: "bg-neutral-700/30 text-neutral-500",
};

interface IProps {
  difficulty: Difficulty;
  size?: "sm" | "md";
}

const DifficultyChip: React.FC<IProps> = ({ difficulty, size = "sm" }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold",
        DIFFICULTY_COLORS[difficulty],
        size === "sm" ? "size-7 text-xs" : "size-9 text-sm",
      )}
    >
      {difficultyToKoreanMap[difficulty]}
    </span>
  );
};
export default DifficultyChip;
