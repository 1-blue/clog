"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "#web/libs/utils";

interface IProps {
  className?: string;
}

const RecordDetailShareRow = ({ className }: IProps) => {
  const share = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: document.title || "clog",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.message("링크를 복사했어요");
      }
    } catch {
      /* 취소 */
    }
  };

  return (
    <div
      className={cn(
        "mt-8 flex items-center justify-between rounded-2xl border border-white/5 bg-surface-container-low/60 px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          aria-label="좋아요"
          onClick={() => toast.message("곧 이용할 수 있어요")}
        >
          <Heart className="size-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          aria-label="댓글"
          onClick={() => toast.message("곧 이용할 수 있어요")}
        >
          <MessageCircle className="size-5" strokeWidth={2} />
        </button>
      </div>
      <button
        type="button"
        onClick={() => void share()}
        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
      >
        <Share2 className="size-4" strokeWidth={2} />
        공유하기
      </button>
    </div>
  );
};

export default RecordDetailShareRow;
