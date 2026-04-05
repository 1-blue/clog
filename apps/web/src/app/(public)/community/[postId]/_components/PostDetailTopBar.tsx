"use client";

import { MoreVertical, Share2 } from "lucide-react";
import { toast } from "sonner";

import TopBar from "#web/components/layout/TopBar";

const PostDetailTopBar = () => {
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
      /* 취소 등 */
    }
  };

  return (
    <TopBar
      showQuickActions={false}
      title="커뮤니티"
      right={
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => void share()}
            className="flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-primary"
            aria-label="공유"
          >
            <Share2 className="size-5" strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-primary"
            aria-label="더보기 (준비 중)"
          >
            <MoreVertical className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
      }
    />
  );
};

export default PostDetailTopBar;
