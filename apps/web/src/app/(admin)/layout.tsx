"use client";

// TODO: 관리자 접근 제한 추가하기
const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="mx-auto max-w-7xl px-8 py-6">{children}</div>;
};

export default Layout;
