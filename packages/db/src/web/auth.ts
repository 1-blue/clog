import { supabase } from "./client-browser";

/**
 * 소셜 로그인 공통 함수 (Web - Browser)
 */
const signInWithOAuth = async (provider: "google" | "kakao") => {
  if (typeof window === "undefined") {
    throw new Error("This function can only be used in the browser");
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Google 로그인 (Web)
 */
export const signInWithGoogleWeb = async () => {
  return signInWithOAuth("google");
};

/**
 * Kakao 로그인 (Web)
 */
export const signInWithKakaoWeb = async () => {
  return signInWithOAuth("kakao");
};

/**
 * 로그아웃
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

/**
 * 현재 세션 가져오기
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
};

/**
 * 현재 사용자 가져오기
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
};
