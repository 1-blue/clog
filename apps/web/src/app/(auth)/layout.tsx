import NavShell from "#web/components/layout/NavShell";

/** 인증·API 의존 페이지 — 빌드 시 정적 프리렌더 생략 */
export const dynamic = "force-dynamic";

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  // 인증 체크는 proxy.ts에서 처리 (미인증 시 /login 리다이렉트)
  return <NavShell>{children}</NavShell>;
};
export default AuthLayout;
