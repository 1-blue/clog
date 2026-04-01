"use client";

import { Controller, useFormContext } from "react-hook-form";

import FormHelper from "#web/components/shared/FormHelper";
import { Textarea } from "#web/components/ui/textarea";

import type { TGymReviewFormData } from "../../../_hooks/useGymReviewForm";

const MAX_LENGTH = 1000;
const STORY_FIELD_ID = "gym-review-story";

const GymReviewStoryField = () => {
  const { control } = useFormContext<TGymReviewFormData>();

  return (
    <Controller
      control={control}
      name="content"
      render={({ field, fieldState }) => (
        <FormHelper
          label="리뷰"
          labelSuffix={
            <span className="text-xs text-on-surface-variant tabular-nums">
              {field.value.length} / {MAX_LENGTH}
            </span>
          }
          htmlFor={STORY_FIELD_ID}
          message={{ error: fieldState.error?.message }}
        >
          <Textarea
            id={STORY_FIELD_ID}
            value={field.value}
            onChange={(e) =>
              field.onChange(e.target.value.slice(0, MAX_LENGTH))
            }
            maxLength={MAX_LENGTH}
            rows={6}
            placeholder="최소 10자 이상 입력해 주세요."
            className="min-h-36 resize-none rounded-xl bg-surface-container-high"
          />
        </FormHelper>
      )}
    />
  );
};

export default GymReviewStoryField;
