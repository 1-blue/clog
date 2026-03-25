"use client";

import { PenLine } from "lucide-react";

import { Textarea } from "#web/components/ui/textarea";
import { cn } from "#web/libs/utils";

interface IProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

const RecordMemoField = ({ value, onChange, className }: IProps) => (
  <div className={cn("space-y-2", className)}>
    <span className="flex items-center gap-2 text-xs font-bold tracking-wider text-outline uppercase">
      <PenLine className="size-3.5 text-on-surface-variant" strokeWidth={2} />
      오늘의 메모
    </span>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="느낌 점, 베스트 루트, 아쉬웠던 점을 적어보세요…"
      rows={4}
      className="w-full resize-none rounded-2xl border border-transparent bg-surface-container-high px-4 py-3 text-sm leading-relaxed text-on-surface placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    />
  </div>
);

export default RecordMemoField;
