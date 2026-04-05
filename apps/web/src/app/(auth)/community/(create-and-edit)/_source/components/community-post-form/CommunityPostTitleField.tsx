"use client";

import { Controller, useFormContext } from "react-hook-form";

import FormHelper from "#web/components/shared/FormHelper";
import { Input } from "#web/components/ui/input";

import type { TCommunityPostFormData } from "../../hooks/useCommunityPostForm";

const CommunityPostTitleField: React.FC = () => {
  const { control } = useFormContext<TCommunityPostFormData>();

  return (
    <Controller
      control={control}
      name="title"
      render={({ field, fieldState }) => (
        <FormHelper label="제목" message={{ error: fieldState.error?.message }}>
          <Input
            {...field}
            type="text"
            placeholder="제목을 입력하세요"
            maxLength={100}
            className="rounded-sm bg-surface-container-high px-4 py-5 text-sm text-on-surface placeholder:text-on-surface-variant"
          />
        </FormHelper>
      )}
    />
  );
};

export default CommunityPostTitleField;
