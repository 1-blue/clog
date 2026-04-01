"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "#web/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "#web/components/ui/carousel";
import { Dialog, DialogPortal } from "#web/components/ui/dialog";
import { cn } from "#web/libs/utils";

/** 탭으로 간주할 최대 이동 거리(px). 이보다 크면 스와이프로 본다 */
const TAP_MOVE_THRESHOLD_PX = 24;

interface IProps {
  urls: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 다이얼로그가 열릴 때 보여줄 슬라이드 인덱스 */
  initialIndex: number;
  /** 이미지 alt 접두사 */
  altPrefix?: string;
}

/** 전체 화면 캐러셀 이미지 라이트박스 (공용) */
const ImageCarouselLightboxDialog: React.FC<IProps> = ({
  urls,
  open,
  onOpenChange,
  initialIndex,
  altPrefix = "이미지",
}) => {
  const titleId = useId();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [slideCount, setSlideCount] = useState(0);

  const pointerStartRef = useRef<{
    clientX: number;
    clientY: number;
    snap: number;
  } | null>(null);

  const safeIndex = Math.min(
    Math.max(0, initialIndex),
    Math.max(0, urls.length - 1),
  );

  useEffect(() => {
    if (!open || !carouselApi) return;
    carouselApi.scrollTo(safeIndex, true);
  }, [open, safeIndex, carouselApi]);

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

  const onPointerDownCapture = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button")) return;
      const snap = carouselApi?.selectedScrollSnap() ?? 0;
      pointerStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        snap,
      };
    },
    [carouselApi],
  );

  const onPointerUpCapture = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button")) {
        pointerStartRef.current = null;
        return;
      }
      const start = pointerStartRef.current;
      pointerStartRef.current = null;
      if (!start || !carouselApi) return;

      const dx = e.clientX - start.clientX;
      const dy = e.clientY - start.clientY;
      const dist = Math.hypot(dx, dy);
      if (dist >= TAP_MOVE_THRESHOLD_PX) return;
      if (carouselApi.selectedScrollSnap() !== start.snap) return;

      onOpenChange(false);
    },
    [carouselApi, onOpenChange],
  );

  if (urls.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-black/90 duration-150 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
          )}
          onClick={() => onOpenChange(false)}
        />
        <DialogPrimitive.Popup
          aria-labelledby={titleId}
          className={cn(
            "fixed inset-0 z-50 flex flex-col bg-transparent p-0 outline-none data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
          )}
        >
          <DialogPrimitive.Title id={titleId} className="sr-only">
            {altPrefix} 전체 보기
          </DialogPrimitive.Title>

          <div className="relative flex min-h-0 flex-1 flex-col">
            <div
              className="absolute inset-0 z-0 cursor-default"
              onClick={() => onOpenChange(false)}
              aria-hidden
            />
            <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col">
              <DialogPrimitive.Close
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="pointer-events-auto absolute top-3 right-3 z-20 rounded-full bg-white/10 text-white hover:bg-white/20"
                    aria-label="닫기"
                  />
                }
              >
                <XIcon className="size-5" />
              </DialogPrimitive.Close>

              {slideCount > 0 ? (
                <p className="pointer-events-auto absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white md:bottom-6">
                  {current} / {slideCount}
                </p>
              ) : null}

              <Carousel
                setApi={setCarouselApi}
                opts={{ align: "center", loop: urls.length > 1 }}
                onPointerDownCapture={onPointerDownCapture}
                onPointerUpCapture={onPointerUpCapture}
                className="pointer-events-auto flex min-h-0 flex-1 flex-col justify-center px-2.5"
              >
                <CarouselContent className="-ml-0 h-full items-stretch">
                  {urls.map((url, i) => (
                    <CarouselItem
                      key={`carousel-${i}-${url}`}
                      className="flex basis-full items-center justify-center pl-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`${altPrefix} ${i + 1}`}
                        className="max-h-[min(85dvh,100vw)] w-auto max-w-full object-contain"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
};

export default ImageCarouselLightboxDialog;
