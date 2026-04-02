import { prisma } from "@clog/db";
import type { User } from "@supabase/supabase-js";

import {
  DEFAULT_COVER_IMAGE_URL,
  DEFAULT_PROFILE_IMAGE_URL,
} from "#web/constants/defaultUserAssets";
import { generateUniqueNickname } from "#web/libs/auth/generateUniqueNickname";
import { linkedProvidersFromSupabase } from "#web/libs/auth/linkedProvidersFromSupabase";
import { notifySlackUserSignup } from "#web/libs/slack/notifications";

/** Supabase Auth 유저를 Prisma `User`에 upsert (콜백·/users/me 등에서 공통 사용) */
export async function syncSupabaseUserToPrisma(user: User) {
  if (!user.email) return;

  const existed = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true },
  });

  const meta = user.user_metadata as Record<string, unknown>;
  const avatar =
    typeof meta.avatar_url === "string"
      ? meta.avatar_url
      : typeof meta.picture === "string"
        ? meta.picture
        : undefined;

  const createNickname = !existed ? await generateUniqueNickname() : "";

  await prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
      nickname: createNickname,
      role: "GUEST",
      profileImage: DEFAULT_PROFILE_IMAGE_URL,
      coverImage: DEFAULT_COVER_IMAGE_URL,
    },
    update: {
      email: user.email,
      ...(avatar ? { profileImage: avatar } : {}),
    },
  });

  if (!existed) {
    notifySlackUserSignup({
      nickname: createNickname,
      userId: user.id,
      email: user.email,
      providers: linkedProvidersFromSupabase(user.identities),
    });
  }
}
