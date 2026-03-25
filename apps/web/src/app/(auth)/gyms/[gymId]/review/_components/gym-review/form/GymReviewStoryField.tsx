"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Label } from "#web/components/ui/label";
import { Textarea } from "#web/components/ui/textarea";

import type { TGymReviewFormData } from "../useGymReviewForm";

const MAX_LENGTH = 1000;

const GymReviewStoryField = () => {
  const { control } = useFormContext<TGymReviewFormData>();

  return (
    <section className="space-y-2">
      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <>
            <div className="flex items-end justify-between gap-2">
              <Label
                htmlFor="gym-review-story"
                className="text-base font-semibold"
              >
                리뷰
              </Label>
              <span className="text-xs tabular-nums text-on-surface-variant">
                {field.value.length} / {MAX_LENGTH}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">
              솔직한 경험을 적어 주시면 다른 클라이머에게 큰 도움이 됩니다.
            </p>
            <Textarea
              id="gym-review-story"
              value={field.value}
              onChange={(e) =>
                field.onChange(e.target.value.slice(0, MAX_LENGTH))
              }
              maxLength={MAX_LENGTH}
              rows={6}
              placeholder="이 암장에서의 경험을 자유롭게 적어 주세요. (최소 10자)"
              className="min-h-36 resize-none rounded-xl bg-surface-container-high"
            />
          </>
        )}
      />
    </section>
  );
};

export default GymReviewStoryField;
