"use client";

import { useFormContext, useWatch } from "react-hook-form";

import MultiImageUploader from "#web/components/shared/MultiImageUploader";

import type { TCommunityPostFormData } from "../../hooks/useCommunityPostForm";

const CommunityPostImageField: React.FC = () => {
  const { setValue } = useFormContext<TCommunityPostFormData>();
  const imageUrls = useWatch({ name: "imageUrls" }) ?? [];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-on-surface">이미지</span>
      <MultiImageUploader
        urls={imageUrls}
        onUrlsChange={(urls) =>
          setValue("imageUrls", urls, { shouldValidate: true, shouldDirty: true })
        }
        maxFiles={10}
      />
    </div>
  );
};

export default CommunityPostImageField;
