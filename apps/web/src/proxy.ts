import NextAuth from "next-auth";

import authConfig from "#web/auth.config";

/**
 * Edge/Proxy에서는 DB adapter(Prisma)를 import하지 않는다.
 * (서버리스에서 커넥션 폭증 → EMAXCONN 방지)
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
