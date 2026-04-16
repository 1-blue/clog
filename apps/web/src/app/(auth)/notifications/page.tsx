"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useNotificationPanel } from "#web/components/notifications/NotificationPanelProvider";
import { ROUTES } from "#web/constants";

/** `/notifications` 진입 시 알림 패널만 열고 마이페이지로 대체합니다. */
const NotificationsRedirectPage = () => {
  const router = useRouter();
  const { open } = useNotificationPanel() ?? {};

  useEffect(() => {
    open?.();
    router.replace(ROUTES.MY.path);
  }, [open, router]);

  return null;
};

export default NotificationsRedirectPage;
