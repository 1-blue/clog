"use client";

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "#web/libs/utils";

interface IProps {
  label?: string;
  className?: string;
  /** router.back 직전 (예: localStorage 초안 삭제) */
  onBeforeBack?: () => void;
}

const RecordDiscardRow = ({
  label = "작성 취소",
  className,
  onBeforeBack,
}: IProps) => {
  const router = useRouter();

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={() => {
          onBeforeBack?.();
          router.back();
        }}
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40",
          "bg-destructive/10 text-sm font-semibold text-destructive",
          "transition-colors hover:bg-destructive/15 active:scale-[0.99]",
        )}
      >
        <Undo2 className="size-4 shrink-0" strokeWidth={2} />
        {label}
      </button>
    </div>
  );
};

export default RecordDiscardRow;
