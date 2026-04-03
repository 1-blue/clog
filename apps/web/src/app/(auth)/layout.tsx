import BottomBarShell from "#web/components/layout/BottomBarShell";
import { NotificationPanelProvider } from "#web/components/notifications/NotificationPanelProvider";

/** 인증·API 의존 페이지 — 빌드 시 정적 프리렌더 생략 */
export const dynamic = "force-dynamic";

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <NotificationPanelProvider>
      <main className="mx-auto w-full max-w-3xl px-2.5">
        <BottomBarShell>{children}</BottomBarShell>
      </main>
    </NotificationPanelProvider>
  );
};
export default AuthLayout;
