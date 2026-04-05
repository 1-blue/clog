"use client";

import {
  ArrowLeft,
  BarChart3,
  Bell,
  Mountain,
  Settings,
  Ticket,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import { useNotificationPanel } from "#web/components/notifications/NotificationPanelProvider";
import { ROUTES } from "#web/constants";
import useMe from "#web/hooks/useMe";
import { cn } from "#web/libs/utils";

const quickActionClass =
  "text-primary transition-opacity hover:opacity-80 active:scale-95";

interface IProps {
  /** 왼쪽 슬롯 — 지정 시 뒤로가기 행보다 우선 */
  left?: React.ReactNode;
  /** 오른쪽 슬롯 — 미지정 시 `showQuickActions`에 따라 기본 퀵 액션(통계·회원권·설정·알림) */
  right?: React.ReactNode;
  /**
   * 기본 우측: 마이페이지 헤더와 동일한 아이콘 묶음(통계·회원권·설정·알림).
   * `right`를 넘기면 이 옵션은 무시됩니다.
   * @default true
   */
  showQuickActions?: boolean;
  className?: string;
  /** 있으면 뒤로 버튼 + 제목 행 (`router.back()`, 히스토리 없으면 홈으로) */
  title?: string;
}

const TopBar: React.FC<IProps> = ({
  left,
  right,
  showQuickActions = true,
  className,
  title,
}) => {
  const router = useRouter();
  const notificationPanel = useNotificationPanel();
  const { me } = useMe();
  const { data: unreadCount = 0 } = openapi.useQuery(
    "get",
    "/api/v1/notifications/unread-count",
    undefined,
    {
      enabled: Boolean(me),
      select: (d) => d.payload.count,
      staleTime: 30_000,
    },
  );
  const hasUnread = unreadCount > 0;

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

  const defaultRight = showQuickActions ? (
    <div className="flex items-center gap-4">
      <Link
        href={ROUTES.STATISTICS.path}
        className={quickActionClass}
        aria-label="통계"
      >
        <BarChart3 className="size-6" strokeWidth={1.75} />
      </Link>
      <Link
        href={ROUTES.MY.MEMBERSHIPS.path}
        className={quickActionClass}
        aria-label="회원권"
      >
        <Ticket className="size-6" strokeWidth={1.75} />
      </Link>
      <Link
        href={ROUTES.MY.SETTINGS.path}
        className={quickActionClass}
        aria-label="설정"
      >
        <Settings className="size-6" strokeWidth={1.75} />
      </Link>
      {notificationPanel ? (
        <button
          type="button"
          onClick={() => notificationPanel.open()}
          className={cn(quickActionClass, "relative")}
          aria-label={hasUnread ? "알림, 읽지 않은 알림 있음" : "알림"}
        >
          <Bell className="size-6" strokeWidth={1.75} aria-hidden />
          {hasUnread ? (
            <span
              className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary ring-2 ring-background"
              aria-hidden
            />
          ) : null}
        </button>
      ) : (
        <Link
          href={ROUTES.NOTIFICATIONS.path}
          className={cn(quickActionClass, "relative inline-flex")}
          aria-label={hasUnread ? "알림, 읽지 않은 알림 있음" : "알림"}
        >
          <Bell className="size-6" strokeWidth={1.75} aria-hidden />
          {hasUnread ? (
            <span
              className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary ring-2 ring-background"
              aria-hidden
            />
          ) : null}
        </Link>
      )}
    </div>
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
