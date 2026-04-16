"use client";

import { AlertTriangle, Frown, Meh, Smile } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import {
  perceivedDifficultyToKoreanMap,
  type PerceivedDifficulty,
} from "@clog/contracts";

import { Label } from "#web/components/ui/label";
import { cn } from "#web/libs/utils";

import type { TGymReviewFormData } from "../../../_hooks/useGymReviewForm";

const OPTIONS: {
  id: PerceivedDifficulty;
  label: string;
  Icon: typeof Smile;
  activeClass: string;
}[] = [
  {
    id: "EASY",
    label: perceivedDifficultyToKoreanMap.EASY,
    Icon: Smile,
    activeClass:
      "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "EASY_NORMAL",
    label: perceivedDifficultyToKoreanMap.EASY_NORMAL,
    Icon: Smile,
    activeClass:
      "border-teal-500/60 bg-teal-500/10 text-teal-800 dark:text-teal-200",
  },
  {
    id: "NORMAL",
    label: perceivedDifficultyToKoreanMap.NORMAL,
    Icon: Meh,
    activeClass:
      "border-amber-500/60 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  },
  {
    id: "NORMAL_HARD",
    label: perceivedDifficultyToKoreanMap.NORMAL_HARD,
    Icon: AlertTriangle,
    activeClass:
      "border-orange-500/60 bg-orange-500/10 text-orange-900 dark:text-orange-200",
  },
  {
    id: "HARD",
    label: perceivedDifficultyToKoreanMap.HARD,
    Icon: Frown,
    activeClass:
      "border-rose-500/60 bg-rose-500/10 text-rose-800 dark:text-rose-200",
  },
];

const GymReviewPerceivedDifficulty = () => {
  const { control, setValue } = useFormContext<TGymReviewFormData>();
  const perceived = useWatch({ control, name: "perceivedDifficulty" });

  return (
    <section className="space-y-3">
      <Label className="text-base font-semibold text-on-surface">
        체감 난이도
      </Label>
      <p className="text-sm text-on-surface-variant">
        이 암장의 루트 난이도는 어떻게 느껴지셨나요?
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {OPTIONS.map(({ id, label, Icon, activeClass }) => {
          const active = perceived === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() =>
                setValue("perceivedDifficulty", active ? undefined : id)
              }
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border px-1.5 py-3 text-center text-xs font-medium transition-colors sm:px-2 sm:py-4 sm:text-sm",
                active
                  ? activeClass
                  : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high",
              )}
            >
              <Icon className="size-8 shrink-0 sm:size-9" strokeWidth={1.75} />
              <span className="leading-tight break-keep">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default GymReviewPerceivedDifficulty;
