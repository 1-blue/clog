import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../types";

/**
 * 서버 환경(Server Components, Route Handlers)에서 사용하는 Supabase 클라이언트
 * @supabase/ssr을 사용하여 쿠키 기반 세션 관리
 */
export const createClientServer = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL 또는 Anon Key가 설정되지 않았습니다. 환경변수를 확인해주세요."
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
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
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component에서는 쿠키를 설정할 수 없음
          // Route Handler나 Server Action에서만 가능
        }
      },
    },
  });
};
