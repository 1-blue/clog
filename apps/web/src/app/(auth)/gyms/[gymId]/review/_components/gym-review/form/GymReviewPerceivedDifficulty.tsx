"use client";

import { Frown, Meh, Smile } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import type { PerceivedDifficulty } from "@clog/utils";
import { perceivedDifficultyToKoreanMap } from "@clog/utils";

import { Label } from "#web/components/ui/label";
import { cn } from "#web/libs/utils";

import type { TGymReviewFormData } from "../useGymReviewForm";

const OPTIONS: {
  id: PerceivedDifficulty;
  label: string;
  Icon: typeof Smile;
  activeClass: string;
}[] = [
  {
    id: "EASY",
    label: perceivedDifficultyToKoreanMap["EASY"],
    Icon: Smile,
    activeClass:
      "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "NORMAL",
    label: perceivedDifficultyToKoreanMap["NORMAL"],
    Icon: Meh,
    activeClass:
      "border-amber-500/60 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  },
  {
    id: "HARD",
    label: perceivedDifficultyToKoreanMap["HARD"],
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
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(({ id, label, Icon, activeClass }) => {
          const active = perceived === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setValue("perceivedDifficulty", active ? undefined : id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-sm font-medium transition-colors",
                active
                  ? activeClass
                  : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high",
              )}
            >
              <Icon className="size-9" strokeWidth={1.75} />
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default GymReviewPerceivedDifficulty;
