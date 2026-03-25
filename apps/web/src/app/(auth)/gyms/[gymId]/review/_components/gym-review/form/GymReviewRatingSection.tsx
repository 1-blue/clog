"use client";

import { Star } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { Label } from "#web/components/ui/label";
import { cn } from "#web/libs/utils";

import type { TGymReviewFormData } from "../useGymReviewForm";

const GymReviewRatingSection = () => {
  const { control, setValue } = useFormContext<TGymReviewFormData>();
  const rating = useWatch({ control, name: "rating" });

  return (
    <section className="space-y-3">
      <div>
        <Label className="text-base font-semibold text-on-surface">
          만족도
        </Label>
        <p className="mt-1 text-sm text-on-surface-variant">
          암장에서의 경험은 어떠셨나요?
        </p>
      </div>
      <div
        className="flex justify-center gap-2 py-1"
        role="group"
        aria-label="별점"
      >
        {Array.from({ length: 5 }, (_, i) => {
          const value = i + 1;
          const filled = value <= rating;
          return (
            <button
              key={value}
              type="button"
              onClick={() =>
                setValue("rating", value, { shouldValidate: true })
              }
              className="rounded-lg p-1 transition-transform active:scale-95"
              aria-label={`${value}점`}
              aria-pressed={filled}
            >
              <Star
                className={cn(
                  "size-10 transition-colors",
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-on-surface-variant/40",
                )}
                strokeWidth={filled ? 0 : 1.5}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default GymReviewRatingSection;
