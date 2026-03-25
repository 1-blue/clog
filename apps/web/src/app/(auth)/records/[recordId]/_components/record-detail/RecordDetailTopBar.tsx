"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps {
  className?: string;
}

const RecordDetailTopBar = ({ className }: IProps) => {
  const router = useRouter();

  return (
    <header
      className={
        className ??
        "pointer-events-none fixed top-0 right-0 left-0 z-50 flex h-14 items-center px-2"
      }
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="pointer-events-auto ml-1 flex size-10 items-center justify-center rounded-full text-primary backdrop-blur-sm transition-opacity hover:opacity-80"
        aria-label="뒤로"
      >
        <ArrowLeft className="size-6" strokeWidth={2} />
      </button>
      <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center text-base font-semibold text-primary">
        클라이밍 기록 상세
      </h1>
    </header>
  );
};

export default RecordDetailTopBar;
