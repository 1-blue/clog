import { supabase } from "./client";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

// WebBrowser가 완료될 때까지 대기하도록 설정
WebBrowser.maybeCompleteAuthSession();

/**
 * 소셜 로그인 공통 함수 (Mobile)
 * expo-web-browser를 사용하여 네이티브 브라우저로 OAuth 처리
 */
const signInWithOAuthMobile = async (provider: "google" | "kakao") => {
  const redirectUrl = Linking.createURL("/auth/callback");

  // OAuth URL 가져오기 (자동 리디렉션 방지)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true, // 자동 리디렉션 방지
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error("OAuth URL이 생성되지 않았습니다.");
  }

  // 네이티브 브라우저로 OAuth 페이지 열기
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

  if (result.type === "success") {
    // 콜백 URL에서 토큰 추출
    const url = new URL(result.url);
    const params = url.searchParams;

    // URL에 code가 있는 경우 (PKCE 플로우)
    const code = params.get("code");
    if (code) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        throw sessionError;
      }

      return sessionData;
    }

    // URL에 직접 토큰이 있는 경우 (레거시 플로우)
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

      if (sessionError) {
        throw sessionError;
      }

      return sessionData;
    }

    throw new Error("인증 토큰을 찾을 수 없습니다.");
  } else if (result.type === "cancel") {
    throw new Error("로그인이 취소되었습니다.");
  } else {
    throw new Error("로그인에 실패했습니다.");
  }
};

/**
 * Google 로그인 (Mobile)
 */
export const signInWithGoogleMobile = async () => {
  return signInWithOAuthMobile("google");
};

/**
 * Kakao 로그인 (Mobile)
 */
export const signInWithKakaoMobile = async () => {
  return signInWithOAuthMobile("kakao");
};
