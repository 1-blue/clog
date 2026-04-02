"use client";

import { ArrowLeft, Bell, Mountain } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

interface IProps {
  /** 왼쪽 슬롯 — 지정 시 뒤로가기 행보다 우선 */
  left?: React.ReactNode;
  /** 오른쪽 슬롯 — 기본: 알림 아이콘 */
  right?: React.ReactNode;
  /** 알림 아이콘 표시 여부 (right 미지정 시). 기본: true */
  showNotification?: boolean;
  className?: string;
  /** 있으면 뒤로 버튼 + 제목 행 (`router.back()`, 히스토리 없으면 홈으로) */
  title?: string;
}

const TopBar: React.FC<IProps> = ({
  left,
  right,
  showNotification = false,
  className,
  title,
}) => {
  const router = useRouter();

  const defaultLeft = (
    <div className="flex items-center gap-2">
      <Mountain className="size-6 text-primary" strokeWidth={2} aria-hidden />
      <span className="text-xl font-bold text-on-surface">클로그</span>
    </div>
  );

  const goBackOrHome = () => {
    if (typeof window !== "undefined" && window.history.length <= 1) {
      router.replace(ROUTES.HOME.path);
      return;
    }
    router.back();
  };

  const showBackNavigation = !left && Boolean(title);

  const backLeft = showBackNavigation ? (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <button
        type="button"
        onClick={goBackOrHome}
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
        aria-label="뒤로"
      >
        <ArrowLeft className="size-5" strokeWidth={2} />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-on-surface">
        {title}
      </h1>
    </div>
  ) : null;

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
      {left ?? backLeft ?? defaultLeft}
      {right ?? defaultRight}
    </header>
  );
};

export default TopBar;
