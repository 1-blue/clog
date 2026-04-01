"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useId } from "react";

import { Button } from "#web/components/ui/button";
import { Dialog, DialogPortal } from "#web/components/ui/dialog";
import { cn } from "#web/libs/utils";

interface IProps {
  url: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 이미지 alt 접두사 */
  altPrefix?: string;
}

/** 전체 화면 단일 이미지 라이트박스 (ImageCarouselLightboxDialog의 캐러셀 없는 형태) */
const ImageLightboxDialog: React.FC<IProps> = ({
  url,
  open,
  onOpenChange,
  altPrefix = "이미지",
}) => {
  const titleId = useId();

  if (!url) {
    return null;
  }

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
            {/* 이미지·닫기 버튼 밖의 어두운 영역 클릭 시 닫기 */}
            <div
              className="absolute inset-0 z-0 cursor-default"
              onClick={() => onOpenChange(false)}
              aria-hidden
            />
            <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 pointer-events-none">
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

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${altPrefix} 전체 보기`}
                className="pointer-events-auto max-h-[min(85dvh,100vw)] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
};

export default ImageLightboxDialog;
