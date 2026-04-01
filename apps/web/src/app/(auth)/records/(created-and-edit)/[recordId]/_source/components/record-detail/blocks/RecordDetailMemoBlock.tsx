"use client";

import { Quote } from "lucide-react";

interface IProps {
  memo: string | null | undefined;
}

const RecordDetailMemoBlock: React.FC<IProps> = ({ memo }) => {
  const text = memo?.trim();
  if (!text) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="flex items-center gap-2 text-lg font-bold text-on-surface">
        <Quote className="size-5 text-primary" strokeWidth={2} />
        개인 메모
      </h2>
      <blockquote className="rounded-2xl border border-white/5 bg-surface-container-low/80 px-4 py-4 text-sm leading-relaxed text-on-surface-variant">
        <span className="whitespace-pre-wrap">{text}</span>
      </blockquote>
    </section>
  );
};

export default RecordDetailMemoBlock;
