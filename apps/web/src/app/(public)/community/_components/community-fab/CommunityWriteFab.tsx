import Link from "next/link";
import { PenLine } from "lucide-react";

import { ROUTES } from "#web/constants";

const CommunityWriteFab = () => {
  return (
    <Link
      href={ROUTES.COMMUNITY.WRITE.path}
      className="fixed right-6 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl shadow-primary/40 transition-transform hover:scale-105 active:scale-90"
      aria-label="글쓰기"
    >
      <PenLine className="size-7" strokeWidth={2} aria-hidden />
    </Link>
  );
};

export default CommunityWriteFab;
