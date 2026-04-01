"use client";

import { Bell, Mountain } from "lucide-react";
import React from "react";
import Link from "next/link";

import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

interface IProps {
  /** 왼쪽 슬롯 — 기본: 로고 */
  left?: React.ReactNode;
  /** 오른쪽 슬롯 — 기본: 알림 아이콘 */
  right?: React.ReactNode;
  /** 알림 아이콘 표시 여부 (right 미지정 시). 기본: true */
  showNotification?: boolean;
  className?: string;
}

const AppTopBar: React.FC<IProps> = ({
  left,
  right,
  showNotification = true,
  className,
}) => {
  const defaultLeft = (
    <div className="flex items-center gap-2">
      <Mountain className="size-6 text-primary" strokeWidth={2} aria-hidden />
      <span className="text-xl font-bold text-on-surface">클로그</span>
    </div>
  );

  const defaultRight = showNotification ? (
    <Link href={ROUTES.NOTIFICATIONS.path} aria-label="알림">
      <Bell
        className="size-6 text-on-surface-variant"
        strokeWidth={2}
        aria-hidden
      />
    </Link>
  ) : null;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 -mx-2.5 flex h-14 items-center justify-between border-b border-outline-variant/30 px-2.5 backdrop-blur-xl",
        className,
      )}
    >
      {left ?? defaultLeft}
      {right ?? defaultRight}
    </header>
  );
};

export default AppTopBar;
