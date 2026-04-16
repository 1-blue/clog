import { NextResponse } from "next/server";

import { prisma } from "@clog/db/prisma";

import { createClient } from "#web/libs/supabase/server";

/** 성공 응답 */
export const json = <T>(payload: T, status = 200) => {
  return NextResponse.json({ payload }, { status });
};

/** 토스트 포함 성공 응답 */
export const jsonWithToast = <T>(payload: T, toast: string, status = 200) => {
  return NextResponse.json({ toast, payload }, { status });
};

/** 에러 응답 */
export const errorResponse = (message: string, status = 400) => {
  return NextResponse.json({ toast: message, payload: null }, { status });
};

/** 무한 스크롤 응답 */
export const paginatedJson = <T>(items: T[], nextCursor: string | null) => {
  return json({ items, nextCursor });
};

/** 인증된 유저 ID 가져오기 */
export const getAuthUserId = async (): Promise<string | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
};

/** 인증 필수 체크 - 실패 시 401 응답 반환 */
export const requireAuth = async () => {
  const userId = await getAuthUserId();
  if (!userId) {
    return { userId: null, error: errorResponse("로그인이 필요합니다.", 401) };
  }
  return { userId, error: null };
};

/** 관리자 권한 필수 체크 - 실패 시 401/403 응답 반환 */
export const requireAdmin = async () => {
  const { userId, error } = await requireAuth();
  if (error) return { userId: null, error };
  const user = await prisma.user.findUnique({
    where: { id: userId! },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") {
    return {
      userId: null,
      error: errorResponse("관리자 권한이 필요합니다.", 403),
    };
  }
  return { userId: userId!, error: null };
};

/** URL 검색 파라미터 파싱 */
export const getSearchParams = (request: Request) => {
  const url = new URL(request.url);
  return Object.fromEntries(url.searchParams.entries());
};
