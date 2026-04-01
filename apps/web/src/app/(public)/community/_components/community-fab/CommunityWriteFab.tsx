"use client";

import { SquarePen } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "#web/constants";
import useMe from "#web/hooks/useMe";
import { cn } from "#web/libs/utils";

const CommunityWriteFab = () => {
  const { me } = useMe();
  const hasActiveCheckIn = Boolean(me?.activeCheckIn);

  return (
    <Link
      href={ROUTES.COMMUNITY.CREATE.path}
      className={cn(
        "fixed right-2.5 z-30 flex size-14 items-center justify-center rounded-full bg-primary/20 text-primary backdrop-blur-md transition-transform hover:scale-105 hover:bg-primary/30 active:scale-90",
        hasActiveCheckIn
          ? "bottom-[calc(5rem+env(safe-area-inset-bottom)+2.5rem)]"
          : "bottom-[calc(5rem+env(safe-area-inset-bottom))]",
      )}
      aria-label="글쓰기"
    >
      <SquarePen
        className="size-6 text-primary"
        strokeWidth={2.5}
        aria-hidden
      />
    </Link>
  );
};

export default CommunityWriteFab;
