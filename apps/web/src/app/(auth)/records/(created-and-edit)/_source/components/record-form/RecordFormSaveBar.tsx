"use client";

import { Loader2 } from "lucide-react";

import { Button } from "#web/components/ui/button";
import { cn } from "#web/libs/utils";

interface IProps {
  savePending: boolean;
  label?: string;
  className?: string;
}

/** 기록 작성/수정 하단 고정 제출 — CommunityPostFormStickyBar와 동일 레이아웃·스타일, `type="submit"` */
const RecordFormSaveBar = ({
  savePending,
  label = "저장",
  className,
}: IProps) => (
  <div
    className={cn(
      "fixed right-0 bottom-0 left-0 z-40 border-t border-white/5 bg-surface/95 px-2.5 pt-4 backdrop-blur-xl max-lg:max-w-none",
      "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
      className,
    )}
  >
    <div className="mx-auto flex max-w-lg">
      <Button
        type="submit"
        disabled={savePending}
        className="flex w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-primary/35 bg-primary/12 py-6 text-base font-semibold text-primary transition-colors hover:bg-primary/18 active:scale-[0.99] disabled:opacity-60"
      >
        {savePending ? (
          <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden />
        ) : null}
        {label}
      </Button>
    </div>
  </div>
);

export default RecordFormSaveBar;
