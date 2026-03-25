"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";

import { Button } from "#web/components/ui/button";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "#web/components/ui/carousel";
import { Dialog, DialogPortal } from "#web/components/ui/dialog";
import { cn } from "#web/libs/utils";

/** 한 줄 썸네일 + 클릭 시 전체 화면 캐러셀(다이얼로그) */
interface IProps {
  urls: string[];
  /** 한 줄에 사용할 최대 칸 수. 넘치면 마지막 칸에 +N */
  maxSlots?: number;
  /** 썸네일·큰 이미지 alt 접두사 */
  altPrefix?: string;
  className?: string;
}

const ImageStripLightbox: React.FC<IProps> = ({
  urls,
  maxSlots = 4,
  altPrefix = "이미지",
  className,
}) => {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [slideCount, setSlideCount] = useState(0);

  const openAt = useCallback((index: number) => {
    setStartIndex(Math.min(Math.max(0, index), urls.length - 1));
    setOpen(true);
  }, [urls.length]);

  useEffect(() => {
    if (!open || !carouselApi) return;
    carouselApi.scrollTo(startIndex, true);
  }, [open, startIndex, carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    const sync = () => {
      setSlideCount(carouselApi.scrollSnapList().length);
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    };
    sync();
    carouselApi.on("reInit", sync);
    carouselApi.on("select", sync);
    return () => {
      carouselApi.off("reInit", sync);
      carouselApi.off("select", sync);
    };
  }, [carouselApi]);

  if (urls.length === 0) return null;

  const overflow =
    urls.length > maxSlots ? urls.length - (maxSlots - 1) : 0;
  const thumbCount =
    overflow > 0 ? maxSlots - 1 : Math.min(urls.length, maxSlots);

  return (
    <>
      <div
        className={cn("mt-2 flex items-center gap-1.5 overflow-hidden", className)}
      >
        {urls.slice(0, thumbCount).map((url, i) => (
          <button
            key={`thumb-${i}-${url}`}
            type="button"
            onClick={() => openAt(i)}
            className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-container-high ring-1 ring-inset ring-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label={`${altPrefix} ${i + 1} 보기`}
          >
            <img
              src={url}
              alt=""
              className="size-full object-cover"
            />
          </button>
        ))}
        {overflow > 0 ? (
          <button
            type="button"
            onClick={() => openAt(thumbCount)}
            className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-sm font-semibold text-on-surface ring-1 ring-inset ring-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label={`나머지 ${overflow}장 보기`}
          >
            +{overflow}
          </button>
        ) : null}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogPrimitive.Backdrop
            className={cn(
              "fixed inset-0 z-50 bg-black/90 duration-150 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
            )}
          />
          <DialogPrimitive.Popup
            aria-labelledby={titleId}
            className={cn(
              "fixed inset-0 z-50 flex flex-col bg-transparent p-0 outline-none data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
            )}
          >
            <DialogPrimitive.Title
              id={titleId}
              className="sr-only"
            >
              {altPrefix} 전체 보기
            </DialogPrimitive.Title>

            <div className="relative flex min-h-0 flex-1 flex-col">
              <DialogPrimitive.Close
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-3 right-3 z-20 rounded-full bg-white/10 text-white hover:bg-white/20"
                    aria-label="닫기"
                  />
                }
              >
                <XIcon className="size-5" />
              </DialogPrimitive.Close>

              {slideCount > 0 ? (
                <p className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white md:bottom-6">
                  {current} / {slideCount}
                </p>
              ) : null}

              <Carousel
                setApi={setCarouselApi}
                opts={{ align: "center", loop: urls.length > 1 }}
                className="flex min-h-0 flex-1 flex-col justify-center px-12 md:px-20"
              >
                <CarouselContent className="-ml-0 h-full items-stretch">
                  {urls.map((url, i) => (
                    <CarouselItem
                      key={`carousel-${i}-${url}`}
                      className="flex basis-full items-center justify-center pl-0"
                    >
                      <img
                        src={url}
                        alt={`${altPrefix} ${i + 1}`}
                        className="max-h-[min(85dvh,100vw)] w-auto max-w-full object-contain"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {urls.length > 1 ? (
                  <>
                    <CarouselPrevious
                      className="top-1/2 left-2 z-20 size-10 -translate-y-1/2 border-white/30 bg-black/40 text-white hover:bg-black/55 hover:text-white disabled:opacity-30 md:left-4"
                    />
                    <CarouselNext
                      className="top-1/2 right-2 z-20 size-10 -translate-y-1/2 border-white/30 bg-black/40 text-white hover:bg-black/55 hover:text-white disabled:opacity-30 md:right-4"
                    />
                  </>
                ) : null}
              </Carousel>
            </div>
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default ImageStripLightbox;
