"use client";

import { ArrowLeft, MoreVertical, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import AppTopBar from "#web/components/layout/AppTopBar";

const PostDetailTopBar = () => {
  const router = useRouter();

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
    <AppTopBar
      showNotification={false}
      className="fixed top-0 inset-x-0 z-50 mx-0 border-b border-white/5 bg-background/80 backdrop-blur-md"
      left={
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="shrink-0 text-primary transition-opacity hover:opacity-80 active:scale-95"
            aria-label="뒤로"
          >
            <ArrowLeft className="size-6" strokeWidth={2} aria-hidden />
          </button>
          <h1 className="truncate text-lg leading-tight font-semibold tracking-tight text-primary">
            커뮤니티
          </h1>
        </div>
      }
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
