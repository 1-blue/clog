"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "#web/components/ui/button";

interface IProps {
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  submitDisabled: boolean;
  submitPending: boolean;
}

const GymReviewTopBar: React.FC<IProps> = ({
  title,
  submitLabel,
  onSubmit,
  submitDisabled,
  submitPending,
}) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-outline-variant bg-surface-container/80 px-4 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex size-10 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
        aria-label="뒤로"
      >
        <ArrowLeft className="size-5" strokeWidth={2} />
      </button>
      <h1 className="flex-1 truncate text-lg font-semibold text-on-surface">
        {title}
      </h1>
      <Button
        type="button"
        size="sm"
        className="rounded-full px-5 font-bold"
        onClick={onSubmit}
        disabled={submitDisabled || submitPending}
      >
        {submitLabel}
      </Button>
    </header>
  );
};

export default GymReviewTopBar;
