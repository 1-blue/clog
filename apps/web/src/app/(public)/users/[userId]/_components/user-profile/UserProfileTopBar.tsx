"use client";

import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

const UserProfileTopBar = () => {
  const router = useRouter();

  return (
    <header className="fixed top-0 right-0 left-0 z-40 mx-auto flex h-16 max-w-lg items-center justify-between border-b border-outline-variant/60 bg-background/95 px-4 backdrop-blur-md">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex size-10 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
        aria-label="뒤로"
      >
        <ArrowLeft className="size-5" strokeWidth={2} />
      </button>
      <h1 className="text-lg font-semibold tracking-tight text-on-surface">
        프로필
      </h1>
      <button
        type="button"
        className="flex size-10 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
        aria-label="메뉴"
      >
        <MoreVertical className="size-5" strokeWidth={2} />
      </button>
    </header>
  );
};

export default UserProfileTopBar;
