"use client";

import { Bell, Mountain } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "#web/constants";

/** 홈 상단 바 — 로고 + 알림 아이콘 */
const HomeTopBar = () => {
  return (
    <div className="flex items-center justify-between px-4 pt-4">
      <div className="flex items-center gap-2">
        <Mountain className="size-6 text-primary" strokeWidth={2} aria-hidden />
        <h1 className="text-xl font-bold text-on-surface">클로그</h1>
      </div>
      <Link href={ROUTES.NOTIFICATIONS.path}>
        <Bell
          className="size-6 text-on-surface-variant"
          strokeWidth={2}
          aria-hidden
        />
      </Link>
    </div>
  );
};

export default HomeTopBar;
