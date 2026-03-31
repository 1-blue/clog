"use client";

import { Star } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import FormHelper from "#web/components/shared/FormHelper";
import { cn } from "#web/libs/utils";

import type { TGymReviewFormData } from "../../../_hooks/useGymReviewForm";

const RATING_GROUP_ID = "gym-review-rating";

const GymReviewRatingSection = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<TGymReviewFormData>();
  const rating = useWatch({ control, name: "rating" });

  return (
    <FormHelper
      label="만족도"
      description="암장에서의 경험은 어떠셨나요?"
      message={{ error: errors.rating?.message }}
      cloneChild={false}
      controlId={RATING_GROUP_ID}
      controlAriaLabel="별점"
    >
      <div className="flex justify-center gap-2 py-1">
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
    </FormHelper>
  );
};

export default GymReviewRatingSection;
