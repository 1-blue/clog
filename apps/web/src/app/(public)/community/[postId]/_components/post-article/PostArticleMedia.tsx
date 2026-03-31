"use client";

import { Images } from "lucide-react";
import { useCallback, useState } from "react";

import ImageCarouselLightboxDialog from "#web/components/shared/image-carousel-lightbox/ImageCarouselLightboxDialog";
import { cn } from "#web/libs/utils";

interface IProps {
  imageUrls: string[];
}

/** 대표 이미지 1장 + 추가 사진이 있으면 배지·그라데이션으로 안내, 탭 시 라이트박스 */
const PostArticleMedia: React.FC<IProps> = ({ imageUrls }) => {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openAt = useCallback(
    (index: number) => {
      setStartIndex(Math.min(Math.max(0, index), imageUrls.length - 1));
      setOpen(true);
    },
    [imageUrls.length],
  );

  if (imageUrls.length === 0) return null;

  const heroUrl = imageUrls[0];
  const extraCount = imageUrls.length - 1;
  const hasMore = extraCount > 0;

  return (
    <>
      <div className="-mx-6 w-screen max-w-none sm:mx-0 sm:w-full">
        <button
          type="button"
          onClick={() => openAt(0)}
          className={cn(
            "group relative block w-full overflow-hidden rounded-2xl bg-surface-container-high text-left",
            "ring-1 ring-foreground/10 ring-inset",
            "transition-shadow focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
            "hover:shadow-lg hover:shadow-black/20",
          )}
          aria-label={
            hasMore
              ? `게시글 사진 ${imageUrls.length}장 전체 보기`
              : "게시글 사진 크게 보기"
          }
        >
          <div className="relative aspect-16/10 max-h-64 w-full sm:max-h-72">
            <img
              src={heroUrl}
              alt=""
              className="size-full object-cover transition-transform duration-300 ease-out group-active:scale-[0.99] group-hover:scale-[1.02]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15"
              aria-hidden
            />
            {hasMore ? (
              <>
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"
                  aria-hidden
                />
                <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm ring-1 ring-white/25">
                  <Images className="size-4 shrink-0 opacity-95" aria-hidden />
                  <span className="tabular-nums">+{extraCount}</span>
                </div>
              </>
            ) : (
              <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/35 px-2 py-1 text-[11px] font-medium text-white/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                탭하여 크게 보기
              </span>
            )}
          </div>
        </button>
      </div>

      <ImageCarouselLightboxDialog
        urls={imageUrls}
        open={open}
        onOpenChange={setOpen}
        initialIndex={startIndex}
        altPrefix="게시글"
      />
    </>
  );
};

export default PostArticleMedia;
