import type { Metadata, Viewport } from "next";

import "./globals.css";

import { Toaster } from "sonner";

import { getSharedMetadata } from "#web/libs/sharedMetadata";
import QueryProvider from "#web/providers/QueryProvider";
import ThemeProvider from "#web/providers/ThemeProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = getSharedMetadata();

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Pretendard 폰트 */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      {/* 확장 프로그램이 body에 속성 주입 시(cz-shortcut-listen 등) hydration 경고 방지 */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <div className="mx-auto w-full max-w-3xl px-2.5">{children}</div>
            <Toaster
              position="top-center"
              toastOptions={{
                className:
                  "!bg-surface-container-high !text-on-surface !border-outline-variant",
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};
export default RootLayout;
