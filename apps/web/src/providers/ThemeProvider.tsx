"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-themes가 테마 플리커 방지용 인라인 <script>를 렌더링함.
// React 19는 컴포넌트 내부의 script에 대해 경고를 내지만, SSR에서 실행은 정상이라 false positive에 가깝다.
// @see https://github.com/shadcn-ui/ui/issues/10104
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Encountered a script tag while rendering React component",
      )
    ) {
      return;
    }
    orig.apply(console, args);
  };
}

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  );
};
export default ThemeProvider;
