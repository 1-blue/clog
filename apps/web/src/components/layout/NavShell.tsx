"use client";

import { usePathname } from "next/navigation";

import { shouldShowBottomNav } from "#web/libs/layout/bottomNavVisibility";
import { cn } from "#web/libs/utils";

import BottomNav from "./BottomNav";
import CheckInStatusBanner from "./CheckInStatusBanner";

const NavShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const show = shouldShowBottomNav(pathname);

  return (
    <>
      <main
        className={cn(
          "flex-1",
          show && "pb-[calc(4rem+env(safe-area-inset-bottom))]",
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
