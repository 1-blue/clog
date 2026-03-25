"use client";

import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useRef, useState } from "react";

import { uploadWithPresignedUrl } from "#web/libs/upload/presignedUpload";
import { cn } from "#web/libs/utils";

interface IProps {
  urls: string[];
  onUrlsChange: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
  emptyLabel?: string;
}

/** S3 presigned로 이미지 여러 장 업로드 */
const MultiImageUploader: React.FC<IProps> = ({
  urls,
  onUrlsChange,
  maxFiles = 10,
  className,
  emptyLabel = "사진 추가",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const arr = Array.from(files);
      const remain = maxFiles - urls.length;
      if (remain <= 0) {
        toast.error(`이미지는 최대 ${maxFiles}장까지 추가할 수 있습니다.`);
        return;
      }
      const slice = arr.slice(0, remain);
      setBusy(true);
      try {
        const next = [...urls];
        for (const file of slice) {
          if (!file.type.startsWith("image/")) {
            toast.error("이미지 파일만 업로드할 수 있습니다.");
            continue;
          }
          const url = await uploadWithPresignedUrl(file, "images");
          next.push(url);
        }
        onUrlsChange(next);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "업로드에 실패했습니다.");
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [urls, onUrlsChange, maxFiles],
  );

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <div className="grid grid-cols-3 gap-2">
        {urls.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative aspect-square overflow-hidden rounded-2xl bg-surface-container-high"
          >
            <img src={url} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => onUrlsChange(urls.filter((_, i) => i !== idx))}
              className="text-on-primary absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-black/50"
              aria-label="이미지 삭제"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>
        ))}

        {urls.length < maxFiles && (
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary/50 hover:bg-surface-container-high disabled:opacity-50"
          >
            <ImagePlus className="size-8 text-primary" strokeWidth={1.75} />
            <span className="text-xs font-bold tracking-wider uppercase">
              {busy ? "업로드 중…" : emptyLabel}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiImageUploader;
