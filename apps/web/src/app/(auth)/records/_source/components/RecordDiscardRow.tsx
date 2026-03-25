"use client";

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "#web/libs/utils";

interface IProps {
  label?: string;
  className?: string;
}

const RecordDiscardRow = ({ label = "작성 취소", className }: IProps) => {
  const router = useRouter();

  return (
    <div className={cn("flex justify-center pt-2", className)}>
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-destructive"
      >
        <Undo2 className="size-4" strokeWidth={2} />
        {label}
      </button>
    </div>
  );
};

export default RecordDiscardRow;
