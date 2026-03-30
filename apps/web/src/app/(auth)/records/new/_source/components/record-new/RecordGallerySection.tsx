"use client";

import { useFormContext, useWatch } from "react-hook-form";

import MultiImageUploader from "#web/components/shared/MultiImageUploader";
import { cn } from "#web/libs/utils";

import type { TRecordFormData } from "../../hooks/useRecordForm";

interface IProps {
  maxFiles?: number;
  className?: string;
}

const RecordGallerySection = ({ maxFiles = 5, className }: IProps) => {
  const { control, setValue } = useFormContext<TRecordFormData>();
  const imageUrls = useWatch({ control, name: "imageUrls" }) ?? [];

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-outline uppercase">
          갤러리
        </span>
        <span className="text-xs text-on-surface-variant">
          오늘의 클라이밍 {imageUrls.length}/{maxFiles}
        </span>
      </div>
      <MultiImageUploader
        urls={imageUrls}
        onUrlsChange={(urls) => setValue("imageUrls", urls)}
        maxFiles={maxFiles}
        emptyLabel="사진 추가"
        className="rounded-2xl border border-dashed border-outline-variant/50 bg-surface-container-low/40 p-3"
      />
    </section>
  );
};

export default RecordGallerySection;
