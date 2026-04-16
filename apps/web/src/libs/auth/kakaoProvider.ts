import type { OAuthConfig } from "next-auth/providers";

/** 카카오 OAuth (NextAuth 내장 provider 없음) */
export const kakaoProvider: OAuthConfig<Record<string, unknown>> = {
  id: "kakao",
  name: "Kakao",
  type: "oauth",
  checks: ["state"],
  client: { token_endpoint_auth_method: "client_secret_post" },
  authorization: {
    url: "https://kauth.kakao.com/oauth/authorize",
    params: {
      scope: "profile_nickname profile_image account_email",
    },
  },
  token: "https://kauth.kakao.com/oauth/token",
  userinfo: "https://kapi.kakao.com/v2/user/me",
  clientId: process.env.KAKAO_REST_API_KEY,
  clientSecret: process.env.KAKAO_SECRET_KEY,
  profile(profile) {
    const p = profile as {
      id: number | string;
      kakao_account?: {
        profile?: { nickname?: string; profile_image_url?: string };
        email?: string;
        has_email?: boolean;
      };
    };
    const acc = p.kakao_account;
    return {
      id: String(p.id),
      name: acc?.profile?.nickname ?? undefined,
      email: acc?.has_email ? acc?.email : null,
      image: acc?.profile?.profile_image_url ?? null,
    };
  },
};
