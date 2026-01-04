"use client";

import { useState } from "react";
import { signInWithGoogleWeb, signInWithKakaoWeb } from "@clog/db/web";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/src/components/ui/card";
import KakaoButton from "./_source/components/KakaoButton";
import GoogleButton from "./_source/components/GoogleButton";

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (
    provider: "google" | "kakao",
    loginFn: () => Promise<unknown>
  ) => {
    setError(null);
    setLoading(provider);

    try {
      await loginFn();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `${provider} 로그인에 실패했습니다.`;
      setError(errorMessage);
      setLoading(null);
    }
  };

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto">
            <Image
              src="/images/common/logo.png"
              alt="클로그"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          <CardTitle className="text-3xl font-bold">클로그</CardTitle>
          <CardDescription className="text-base">
            클라이밍 기록을 시작하세요
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <GoogleButton
              loading={loading === "google"}
              onClick={() => handleSocialLogin("google", signInWithGoogleWeb)}
              disabled={loading !== null}
            />

            <KakaoButton
              loading={loading === "kakao"}
              onClick={() => handleSocialLogin("kakao", signInWithKakaoWeb)}
              disabled={loading !== null}
            />
          </div>

          {/* Terms */}
          <p className="text-muted-foreground pt-4 text-center text-xs">
            계속 진행하면 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
