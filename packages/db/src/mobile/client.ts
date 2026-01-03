import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️  Supabase URL 또는 Anon Key가 설정되지 않았습니다.\n" +
      "환경변수를 확인해주세요:\n" +
      "- NEXT_PUBLIC_SUPABASE_URL (Web용)\n" +
      "- NEXT_PUBLIC_SUPABASE_ANON_KEY (Web용)\n" +
      "- EXPO_PUBLIC_SUPABASE_URL (Mobile용)\n" +
      "- EXPO_PUBLIC_SUPABASE_ANON_KEY (Mobile용)"
  );
}

// Supabase 클라이언트 생성 (타입 안전성 포함)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
