import { NextResponse } from "next/server";

import { catchApiError } from "#web/libs/api/errorCatch";

/**
 * 헬스체크 — 기본 200 `{ status: "ok", timestamp }`
 *
 * Slack/DB 에러 파이프라인 검증:
 * - `HEALTH_ERROR_TEST_SECRET` 환경변수 설정 후
 * - 헤더 `x-health-error-test: <동일값>` 또는 쿼리 `?error_test=<동일값>`
 * - 비밀 미설정 시 테스트 분기는 비활성화 (오남용 방지)
 */
export const GET = async (request: Request) => {
  const secret = process.env.HEALTH_ERROR_TEST_SECRET?.trim();
  if (secret) {
    const header = request.headers.get("x-health-error-test")?.trim();
    const q = new URL(request.url).searchParams.get("error_test")?.trim();
    if (header === secret || q === secret) {
      try {
        throw new Error("Health check: intentional error for Slack/DB probe");
      } catch (error) {
        return catchApiError(
          request,
          error,
          "헬스체크 의도적 오류(에러 알림 테스트)",
          { status: 500, userId: null },
        );
      }
    }
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
};
