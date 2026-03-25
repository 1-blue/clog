import { prisma } from "@clog/db";
import type { User } from "@supabase/supabase-js";

/** Supabase Auth 유저를 Prisma `User`에 upsert (콜백·/users/me 등에서 공통 사용) */
export async function syncSupabaseUserToPrisma(user: User) {
  if (!user.email) return;

  const meta = user.user_metadata as Record<string, unknown>;
  const nicknameRaw =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    (typeof meta.nickname === "string" && meta.nickname) ||
    (typeof meta.preferred_username === "string" &&
      meta.preferred_username) ||
    user.email.split("@")[0];
  const nickname =
    nicknameRaw.length > 50 ? nicknameRaw.slice(0, 50) : nicknameRaw;

  const avatar =
    typeof meta.avatar_url === "string"
      ? meta.avatar_url
      : typeof meta.picture === "string"
        ? meta.picture
        : undefined;

  await prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email,
      nickname,
      role: "GUEST",
      ...(avatar ? { profileImage: avatar } : {}),
    },
    update: {
      email: user.email,
      ...(avatar ? { profileImage: avatar } : {}),
    },
  });
}
