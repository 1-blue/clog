"use client";

import { Loader2 } from "lucide-react";

import { Button } from "#web/components/ui/button";
import { cn } from "#web/libs/utils";

interface IProps {
  label: string;
  pending: boolean;
  onSubmit: () => void;
  className?: string;
}

/** 커뮤니티 글 작성/수정 하단 고정 제출 */
const CommunityPostFormStickyBar: React.FC<IProps> = ({
  label,
  pending,
  onSubmit,
  className,
}) => {
  return (
    <div
      className={cn(
        "fixed right-0 bottom-0 left-0 z-30 border-t border-white/5 bg-surface/95 px-4 pt-4 backdrop-blur-xl max-lg:max-w-none",
        "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="mx-auto flex max-w-lg">
        <Button
          type="button"
          disabled={pending}
          onClick={onSubmit}
          className="flex h-14 w-full min-w-0 items-center justify-center gap-2 rounded-2xl border border-primary/35 bg-primary/12 text-base font-semibold text-primary transition-colors hover:bg-primary/18 active:scale-[0.99] disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden />
          ) : null}
          {label}
        </Button>
      </div>
    </div>
  );
};

export default CommunityPostFormStickyBar;
