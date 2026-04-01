"use client";

import { Controller, useFormContext } from "react-hook-form";

import FormHelper from "#web/components/shared/FormHelper";
import { Input } from "#web/components/ui/input";

import type { TCommunityPostFormData } from "../../hooks/useCommunityPostForm";

const CommunityPostTagsField: React.FC = () => {
  const { control } = useFormContext<TCommunityPostFormData>();

  return (
    <Controller
      control={control}
      name="tagInput"
      render={({ field, fieldState }) => (
        <FormHelper
          label="태그 (쉼표로 구분)"
          description="최대 5개, 각 20자까지"
          message={{ error: fieldState.error?.message }}
        >
          <Input
            {...field}
            type="text"
            placeholder="볼더링, 초보, 서울"
            className="rounded-xl bg-surface-container-high px-3 py-3 text-sm text-on-surface placeholder:text-on-surface-variant"
          />
        </FormHelper>
      )}
    />
  );
};

export default CommunityPostTagsField;
