"use client";

import { useCallback, useState } from "react";

import { cn } from "#web/libs/utils";

import ImageCarouselLightboxDialog from "./image-carousel-lightbox/ImageCarouselLightboxDialog";

/** 한 줄 썸네일 + 클릭 시 전체 화면 캐러셀(다이얼로그) */
interface IProps {
  urls: string[];
  /** 한 줄에 사용할 최대 칸 수. 넘치면 마지막 칸에 +N */
  maxSlots?: number;
  /** 썸네일·큰 이미지 alt 접두사 */
  altPrefix?: string;
  className?: string;
  /** 썸네일 버튼 크기·모양 (기본: 작은 스트립) */
  thumbClassName?: string;
}

const ImageStripLightbox: React.FC<IProps> = ({
  urls,
  maxSlots = 4,
  altPrefix = "이미지",
  className,
  thumbClassName,
}) => {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openAt = useCallback(
    (index: number) => {
      setStartIndex(Math.min(Math.max(0, index), urls.length - 1));
      setOpen(true);
    },
    [urls.length],
  );

  if (urls.length === 0) return null;

  const overflow = urls.length > maxSlots ? urls.length - (maxSlots - 1) : 0;
  const thumbCount =
    overflow > 0 ? maxSlots - 1 : Math.min(urls.length, maxSlots);

  return (
    <>
      <div className={cn("flex items-center gap-2 overflow-hidden", className)}>
        {urls.slice(0, thumbCount).map((url, i) => (
          <button
            key={`thumb-${i}-${url}`}
            type="button"
            onClick={() => openAt(i)}
            className={cn(
              "relative shrink-0 cursor-pointer overflow-hidden rounded-lg bg-surface-container-high ring-1 ring-foreground/10 ring-inset focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
              thumbClassName ?? "size-14",
            )}
            aria-label={`${altPrefix} ${i + 1} 보기`}
          >
            <img src={url} alt="" className="size-full object-cover" />
          </button>
        ))}
        {overflow > 0 ? (
          <button
            type="button"
            onClick={() => openAt(thumbCount)}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-sm font-semibold text-on-surface ring-1 ring-foreground/15 ring-inset focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
              thumbClassName ?? "size-14",
            )}
            aria-label={`나머지 ${overflow}장 보기`}
          >
            +{overflow}
          </button>
        ) : null}
      </div>

      <ImageCarouselLightboxDialog
        urls={urls}
        open={open}
        onOpenChange={setOpen}
        initialIndex={startIndex}
        altPrefix={altPrefix}
      />
    </>
  );
};

export default ImageStripLightbox;
