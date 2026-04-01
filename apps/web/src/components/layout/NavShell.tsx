"use client";

import { usePathname } from "next/navigation";

import { shouldShowBottomNav } from "#web/libs/layout/bottomNavVisibility";
import useMe from "#web/hooks/useMe";
import { cn } from "#web/libs/utils";

import BottomNav from "./BottomNav";
import CheckInStatusBanner from "./CheckInStatusBanner";

/** 하단 네비(h-16) + 체크인 배너(대략) — 스크롤 콘텐츠가 배너에 가리지 않도록 */
const MAIN_PB_WITH_CHECKIN =
  "pb-[calc(7.25rem+env(safe-area-inset-bottom))]" as const;
const MAIN_PB_NAV_ONLY =
  "pb-[calc(4rem+env(safe-area-inset-bottom))]" as const;

const NavShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const show = shouldShowBottomNav(pathname);
  const { me } = useMe();
  const hasActiveCheckIn = Boolean(me?.activeCheckIn);

  return (
    <>
      <main
        className={cn(
          "flex-1",
          show &&
            (hasActiveCheckIn ? MAIN_PB_WITH_CHECKIN : MAIN_PB_NAV_ONLY),
        )}
      >
        {children}
      </main>
      {show ? (
        <>
          <CheckInStatusBanner />
          <BottomNav />
        </>
      ) : null}
    </>
  );
};

export default NavShell;
