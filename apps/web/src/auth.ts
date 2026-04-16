import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { prisma } from "@clog/db/prisma";

import authConfig from "#web/auth.config";
import { generateUniqueNickname } from "#web/libs/auth/generateUniqueNickname";
import { getLinkedProvidersForUserId } from "#web/libs/auth/linkedProviders";
import { notifySlackUserSignup } from "#web/libs/slack/notifications";
import {
  DEFAULT_COVER_IMAGE_URL,
  DEFAULT_PROFILE_IMAGE_URL,
} from "#web/constants/defaultUserAssets";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  /** Edge 미들웨어와 호환 (DB 세션은 Prisma Edge 미지원) */
  session: { strategy: "jwt" },
  events: {
    async createUser({ user }) {
      if (!user.id || !user.email) return;
      const nickname = await generateUniqueNickname();
      await prisma.user.update({
        where: { id: user.id },
        data: {
          nickname,
          profileImage: user.image ?? DEFAULT_PROFILE_IMAGE_URL,
          coverImage: DEFAULT_COVER_IMAGE_URL,
        },
      });
    },
    async linkAccount({ user }) {
      if (!user.id || !user.email) return;
      const count = await prisma.account.count({ where: { userId: user.id } });
      if (count !== 1) return;
      const u = await prisma.user.findUnique({
        where: { id: user.id },
        select: { nickname: true, email: true },
      });
      if (!u) return;
      const providers = await getLinkedProvidersForUserId(user.id);
      notifySlackUserSignup({
        nickname: u.nickname,
        userId: user.id,
        email: u.email,
        providers,
      });
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (!user.email) return false;
      return true;
    },
  },
});
