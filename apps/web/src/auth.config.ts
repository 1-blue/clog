import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { signInWithGoogleIdToken } from "#web/libs/auth/googleNativeSignIn";
import { kakaoProvider } from "#web/libs/auth/kakaoProvider";

/** 인증이 필요한 경로 패턴 (proxy.ts와 동일) */
const AUTH_ROUTES = [
  "/my",
  "/records",
  "/statistics",
  "/notifications",
  "/community/create",
  "/community/edit",
];

const isGymReviewAuthRoute = (pathname: string) =>
  /^\/gyms\/[^/]+\/review(\/.*)?$/.test(pathname);

const isAuthRoute = (pathname: string) => {
  if (isGymReviewAuthRoute(pathname)) return true;
  return AUTH_ROUTES.some((route) => {
    if (route.includes("*")) {
      const regex = new RegExp(`^${route.replace(/\*/g, "[^/]+")}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });
};

const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      /**
       * Supabase → NextAuth 마이그레이션 구간: 기존 `users.email`은 남아있고 `accounts`는 재생성되므로
       * 동일 이메일로 들어온 OAuth 계정을 기존 유저에 자동 연결해 로그인 가능하게 한다.
       */
      allowDangerousEmailAccountLinking: true,
    }),
    kakaoProvider,
    Credentials({
      id: "google-id-token",
      name: "Google (native)",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        const raw = credentials?.idToken;
        if (typeof raw !== "string" || !raw.trim()) return null;
        return signInWithGoogleIdToken(raw.trim());
      },
    }),
  ],
  pages: { signIn: "/login" },
  trustHost: true,
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (isAuthRoute(pathname)) return !!auth?.user;
      return true;
    },
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
