import { NextResponse } from "next/server";
import { createClientServer } from "@clog/db/web/client-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClientServer();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ Session exchange error:", error);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message)}`,
          requestUrl.origin
        )
      );
    }

    // 세션이 성공적으로 설정되었으므로 홈으로 리디렉션
    console.log("✅ OAuth callback successful, redirecting to home");
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  }

  return NextResponse.redirect(
    new URL("/login?error=no_code", requestUrl.origin)
  );
}
