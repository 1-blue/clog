"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import AppTopBar from "#web/components/layout/AppTopBar";

interface IProps {
  title: string;
}

const GymReviewTopBar: React.FC<IProps> = ({ title }) => {
  const router = useRouter();

  return (
    <AppTopBar
      showNotification={false}
      className="sticky top-0 z-40 mx-0 border-b border-outline-variant bg-surface-container/80 backdrop-blur-xl"
      left={
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
            aria-label="뒤로"
          >
            <ArrowLeft className="size-5" strokeWidth={2} />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-on-surface">
            {title}
          </h1>
        </div>
      }
      right={<></>}
    />
  );
};

export default GymReviewTopBar;
