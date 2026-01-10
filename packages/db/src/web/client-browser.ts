import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../types";

/** 브라우저(클라이언트) 환경에서 사용하는 Supabase 클라이언트 생성 함수 */
export const createClientBrowser = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "⚠️  Supabase URL 또는 Anon Key가 설정되지 않았습니다.\n" +
        "환경변수를 확인해주세요:\n" +
        "- NEXT_PUBLIC_SUPABASE_URL\n" +
        "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

/** 브라우저 환경에서 사용하는 Supabase 클라이언트 인스턴스 */
export const supabase = createClientBrowser();
