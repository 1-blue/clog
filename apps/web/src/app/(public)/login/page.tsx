"use client";

import { Mountain } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { Button } from "#web/components/ui/button";
import { ROUTES } from "#web/constants";
import { getSharedMetadata } from "#web/libs/sharedMetadata";
import { createClient } from "#web/libs/supabase/client";

export const metadata: Metadata = getSharedMetadata({
  title: "로그인",
});

const LoginPage = () => {
  const supabase = createClient();

  const buildRedirectTo = () => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("callbackUrl") ?? ROUTES.HOME.path;
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
  };

  const signInWithKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: buildRedirectTo() },
    });
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: buildRedirectTo() },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-surface px-6 py-12">
      <div />

      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 -m-4 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative flex size-20 items-center justify-center rounded-3xl bg-primary-container">
            <Mountain
              className="size-9 text-on-primary-container"
              strokeWidth={2}
              aria-hidden
            />
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-on-surface">
              클로그
            </h1>
            <span className="size-2.5 animate-pulse rounded-full bg-secondary" />
          </div>
          <p className="mt-2 text-on-surface-variant">
            클라이머를 위한 커뮤니티 · 기록 앱
          </p>
          <p className="mx-auto mt-4 max-w-xs text-xs leading-relaxed text-on-surface-variant/90">
            로그인 없이도 게시글을 읽을 수 있어요. 댓글과 글쓰기는 로그인 후
            이용할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => void signInWithKakao()}
          className="h-12 w-full gap-2 rounded-2xl bg-yellow-400 font-medium text-neutral-900 hover:bg-yellow-400/90 hover:text-neutral-900"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="#191919">
            <path d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.74 4.92 4.36 6.24-.14.52-.9 3.36-.93 3.58 0 0-.02.16.08.22.1.06.22.02.22.02.3-.04 3.44-2.26 3.98-2.64.74.1 1.52.16 2.3.16 5.52 0 10-3.36 10-7.58C22 6.36 17.52 3 12 3" />
          </svg>
          카카오로 시작하기
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => void signInWithGoogle()}
          className="h-12 w-full gap-2 rounded-2xl font-medium"
        >
          <svg viewBox="0 0 24 24" className="size-5">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google 계정으로 로그인
        </Button>

        <Link
          href={ROUTES.HOME.path}
          className="group mt-2 text-center text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="border-b border-transparent group-hover:border-on-surface-variant/30">
            로그인 없이 둘러보기
          </span>
        </Link>
      </div>

      <p className="text-center text-xs text-on-surface-variant/60">
        로그인 시 이용약관 및 개인정보처리방침에 동의합니다.
      </p>
    </div>
  );
};

export default LoginPage;
