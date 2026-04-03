"use client";

import { Images, Mountain } from "lucide-react";
import { useCallback, useState } from "react";

import ImageCarouselLightboxDialog from "#web/components/shared/image-carousel-lightbox/ImageCarouselLightboxDialog";
import { cn } from "#web/libs/utils";

/** (auth) layout `main`의 `px-2.5`만큼 좌우로 벌려 엣지 투 엣지로 보이게 함 (`-mx`만으로는 flex 자식에서 폭이 안 늘어나는 경우가 있어 width 보정 포함) */
const heroBleedClass =
  "relative -mx-2.5 w-[calc(100%+1.25rem)] max-w-none min-w-0 shrink-0 self-stretch";

interface IProps {
  imageUrls: string[];
  /** DB에 사진이 없을 때 암장 로고 등 표시용 */
  fallbackImageUrl?: string | null;
  className?: string;
}

/** 대표 1장 + 다장일 때 배지, 탭 시 라이트박스. 이미지 없으면 플레이스홀더만 */
const RecordDetailHeroCarousel: React.FC<IProps> = ({
  imageUrls,
  fallbackImageUrl,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const displayUrls =
    imageUrls.length > 0
      ? imageUrls
      : fallbackImageUrl
        ? [fallbackImageUrl]
        : [];

  const openAt = useCallback(
    (index: number) => {
      setStartIndex(Math.min(Math.max(0, index), displayUrls.length - 1));
      setOpen(true);
    },
    [displayUrls.length],
  );

  if (displayUrls.length === 0) {
    return (
      <div
        className={cn(
          heroBleedClass,
          "overflow-hidden bg-surface-container-high",
          className,
        )}
      >
        <div
          className="flex h-40 w-full items-center justify-center sm:h-44 md:h-48"
          role="img"
          aria-label="등록된 사진 없음"
        >
          <Mountain
            className="size-20 text-on-surface-variant/40"
            strokeWidth={1.25}
          />
        </div>
      </div>
    );
  }

  const heroUrl = displayUrls[0]!;
  const extraCount = displayUrls.length - 1;
  const hasMore = extraCount > 0;

  return (
    <>
      <div
        className={cn(
          heroBleedClass,
          "overflow-hidden bg-surface-container-high",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => openAt(0)}
          className={cn(
            "group relative block w-full overflow-hidden text-left",
            "transition-shadow focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
          )}
          aria-label={
            hasMore
              ? `기록 사진 ${displayUrls.length}장 전체 보기`
              : "기록 사진 크게 보기"
          }
        >
          <div className="relative h-40 w-full sm:h-44 md:h-48">
            <img
              src={heroUrl}
              alt=""
              className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01] group-active:scale-[0.99]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/25" />
            <div
              className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"
              aria-hidden
            />
            {hasMore ? (
              <>
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent"
                  aria-hidden
                />
                <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white shadow-lg ring-1 ring-white/25 backdrop-blur-sm">
                  <Images className="size-4 shrink-0 opacity-95" aria-hidden />
                  <span className="tabular-nums">+{extraCount}</span>
                </div>
              </>
            ) : (
              <span className="pointer-events-none absolute right-3 bottom-3 rounded-md bg-black/40 px-2 py-1 text-[11px] font-medium text-white/95 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                탭하여 크게 보기
              </span>
            )}
          </div>
        </button>
      </div>

      <ImageCarouselLightboxDialog
        urls={displayUrls}
        open={open}
        onOpenChange={setOpen}
        initialIndex={startIndex}
        altPrefix="기록"
      />
    </>
  );
};

export default RecordDetailHeroCarousel;
