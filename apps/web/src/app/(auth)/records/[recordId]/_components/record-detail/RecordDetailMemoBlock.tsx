"use client";

import { Quote } from "lucide-react";

import { cn } from "#web/libs/utils";

interface IProps {
  memo: string | null | undefined;
  className?: string;
}

const RecordDetailMemoBlock = ({ memo, className }: IProps) => {
  const text = memo?.trim();
  if (!text) return null;

  return (
    <section className={cn("mt-10", className)}>
      <h2 className="flex items-center gap-2 text-lg font-bold text-on-surface">
        <Quote className="size-5 text-primary" strokeWidth={2} />
        개인 메모
      </h2>
      <blockquote className="mt-3 rounded-2xl border border-white/5 bg-surface-container-low/80 px-4 py-4 text-sm leading-relaxed text-on-surface-variant">
        <span className="whitespace-pre-wrap">{text}</span>
      </blockquote>
    </section>
  );
};

export default RecordDetailMemoBlock;
