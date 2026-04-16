import { OAuth2Client } from "google-auth-library";

import { prisma } from "@clog/db/prisma";

import {
  DEFAULT_COVER_IMAGE_URL,
  DEFAULT_PROFILE_IMAGE_URL,
} from "#web/constants/defaultUserAssets";
import { notifySlackUserSignup } from "#web/libs/slack/notifications";

import { generateUniqueNickname } from "./generateUniqueNickname";
import { getLinkedProvidersForUserId } from "./linkedProviders";

const googleIdTokenAudiences = (): string[] => {
  const ids = [
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_ANDROID_CLIENT_ID,
  ].filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  return [...new Set(ids.map((s) => s.trim()))];
};

/**
 * 네이티브 Google Sign-In에서 받은 id_token 검증 후 User/Account 연결 (웹 OAuth와 동일 규칙).
 * `aud`는 웹·Android OAuth 클라이언트 ID 중 하나와 일치하면 된다.
 */
export const signInWithGoogleIdToken = async (
  idToken: string,
): Promise<{ id: string; name?: string | null; email: string; image?: string | null } | null> => {
  const audience = googleIdTokenAudiences();
  if (audience.length === 0) {
    console.error("[google-native] missing GOOGLE_CLIENT_ID");
    return null;
  }

  const oauth2 = new OAuth2Client();
  let ticket;
  try {
    ticket = await oauth2.verifyIdToken({
      idToken,
      audience,
    });
  } catch (e) {
    console.error("[google-native] verifyIdToken failed");
    return null;
  }

  const payload = ticket.getPayload();
  if (!payload?.email || !payload.sub) return null;

  const googleSub = payload.sub;
  const email = payload.email;
  const name = payload.name ?? "";
  const image = payload.picture ?? null;

  const existing = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: googleSub,
      },
    },
    include: { user: true },
  });

  if (existing?.user) {
    const u = existing.user;
    return {
      id: u.id,
      name: u.name ?? name,
      email: u.email,
      image: u.image ?? image,
    };
  }

  const byEmail = await prisma.user.findUnique({ where: { email } });

  if (byEmail) {
    await prisma.account.create({
      data: {
        userId: byEmail.id,
        type: "oauth",
        provider: "google",
        providerAccountId: googleSub,
        id_token: idToken,
      },
    });
    return {
      id: byEmail.id,
      name: byEmail.name ?? name,
      email: byEmail.email,
      image: byEmail.image ?? image,
    };
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      emailVerified: new Date(),
      name,
      image,
      nickname: "",
    },
  });

  await prisma.account.create({
    data: {
      userId: newUser.id,
      type: "oauth",
      provider: "google",
      providerAccountId: googleSub,
      id_token: idToken,
    },
  });

  const nickname = await generateUniqueNickname();
  await prisma.user.update({
    where: { id: newUser.id },
    data: {
      nickname,
      profileImage: image ?? DEFAULT_PROFILE_IMAGE_URL,
      coverImage: DEFAULT_COVER_IMAGE_URL,
    },
  });

  const u = await prisma.user.findUniqueOrThrow({
    where: { id: newUser.id },
    select: { id: true, nickname: true, email: true },
  });
  const providers = await getLinkedProvidersForUserId(u.id);
  notifySlackUserSignup({
    nickname: u.nickname,
    userId: u.id,
    email: u.email,
    providers,
  });

  return {
    id: newUser.id,
    name,
    email,
    image: image ?? DEFAULT_PROFILE_IMAGE_URL,
  };
};
