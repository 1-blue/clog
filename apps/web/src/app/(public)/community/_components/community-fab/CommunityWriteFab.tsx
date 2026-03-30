import Link from "next/link";
import { SquarePen } from "lucide-react";

import { ROUTES } from "#web/constants";

const CommunityWriteFab = () => {
  return (
    <Link
      href={ROUTES.COMMUNITY.WRITE.path}
      className="fixed right-6 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-primary shadow-2xl shadow-primary/40 transition-transform hover:scale-105 active:scale-90"
      aria-label="글쓰기"
    >
      <SquarePen
        className="size-6 text-on-primary-container"
        strokeWidth={2.5}
        aria-hidden
      />
    </Link>
  );
};

export default CommunityWriteFab;
