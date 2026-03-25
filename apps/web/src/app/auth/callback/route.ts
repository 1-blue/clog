import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "#web/libs/supabase/server";
import { syncSupabaseUserToPrisma } from "#web/libs/auth/syncSupabaseUserToPrisma";

/** OAuth PKCE 콜백 — Supabase 대시보드 Redirect URL에 동일 경로 등록 필요 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await syncSupabaseUserToPrisma(user);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
