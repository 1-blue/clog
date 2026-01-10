import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Database } from "@clog/db/web";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("❌ Supabase URL or Anon Key is missing");
      return NextResponse.redirect(
        new URL("/login?error=configuration_error", requestUrl.origin)
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(
            cookiesToSet: Array<{
              name: string;
              value: string;
              options: CookieOptions;
            }>
          ) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                // httpOnly를 false로 설정하여 클라이언트 JavaScript에서 접근 가능하게 함
                cookieStore.set(name, value, {
                  ...options,
                  httpOnly: false,
                })
              );
            } catch (error) {
              // Route Handler에서는 쿠키 설정이 가능해야 함
              console.error("❌ Error setting cookies:", error);
            }
          },
        },
      }
    );

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
