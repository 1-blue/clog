"use client";

import MultiImageUploader from "#web/components/shared/MultiImageUploader";
import { cn } from "#web/libs/utils";

interface IProps {
  urls: string[];
  onUrlsChange: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
}

const RecordGallerySection = ({
  urls,
  onUrlsChange,
  maxFiles = 5,
  className,
}: IProps) => (
  <section className={cn("space-y-3", className)}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold tracking-wider text-outline uppercase">
        갤러리
      </span>
      <span className="text-xs text-on-surface-variant">
        오늘의 클라이밍 {urls.length}/{maxFiles}
      </span>
    </div>
    <MultiImageUploader
      urls={urls}
      onUrlsChange={onUrlsChange}
      maxFiles={maxFiles}
      emptyLabel="사진 추가"
      className="rounded-2xl border border-dashed border-outline-variant/50 bg-surface-container-low/40 p-3"
    />
  </section>
);

export default RecordGallerySection;
