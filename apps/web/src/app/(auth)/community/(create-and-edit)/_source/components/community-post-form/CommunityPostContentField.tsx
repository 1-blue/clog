"use client";

import { Controller, useFormContext } from "react-hook-form";

import FormHelper from "#web/components/shared/FormHelper";
import { Textarea } from "#web/components/ui/textarea";

import type { TCommunityPostFormData } from "../../hooks/useCommunityPostForm";

const CommunityPostContentField: React.FC = () => {
  const { control, watch } = useFormContext<TCommunityPostFormData>();
  const len = watch("content")?.length ?? 0;

  return (
    <Controller
      control={control}
      name="content"
      render={({ field, fieldState }) => (
        <FormHelper
          label="내용"
          labelSuffix={
            <span className="text-xs font-normal text-on-surface-variant">
              {len}/5000
            </span>
          }
          message={{ error: fieldState.error?.message }}
        >
          <Textarea
            {...field}
            placeholder="내용을 입력하세요 (최소 10자)"
            rows={10}
            className="min-h-60 resize-none rounded-xl bg-surface-container-high px-3 py-3 text-sm text-on-surface placeholder:text-on-surface-variant"
          />
        </FormHelper>
      )}
    />
  );
};

export default CommunityPostContentField;
