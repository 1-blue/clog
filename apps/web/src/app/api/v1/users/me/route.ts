import { prisma } from "@clog/db";
import { updateUserSchema } from "@clog/utils";

import { errorResponse, json, jsonWithToast, requireAuth } from "#web/libs/api";
import { syncSupabaseUserToPrisma } from "#web/libs/auth/syncSupabaseUserToPrisma";
import { createClient } from "#web/libs/supabase/server";
import { getUserProfileStats } from "#web/libs/user/profileStats";

type LinkedProvider = "KAKAO" | "GOOGLE";

function linkedProvidersFromSupabase(
  identities: { provider?: string }[] | null | undefined,
): LinkedProvider[] {
  const set = new Set<LinkedProvider>();
  for (const id of identities ?? []) {
    const p = id.provider?.toLowerCase();
    if (p === "kakao") set.add("KAKAO");
    if (p === "google") set.add("GOOGLE");
  }
  return [...set];
}

const meInclude = {
  _count: {
    select: { following: true, followers: true, sessions: true },
  },
} as const;

/** 내 정보 */
export const GET = async () => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    let user = await prisma.user.findUnique({
      where: { id: userId! },
      include: meInclude,
    });

    if (!user) {
      const supabase = await createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser?.id === userId) {
        await syncSupabaseUserToPrisma(authUser);
        user = await prisma.user.findUnique({
          where: { id: userId! },
          include: meInclude,
        });
      }
    }

    if (!user) return errorResponse("유저를 찾을 수 없습니다.", 404);

    const { visitCount, sendCount } = await getUserProfileStats(user.id, "owner");

    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    const linkedProviders = linkedProvidersFromSupabase(authUser?.identities);

    /** 활성 체크인 조회 */
    const now = new Date();
    const activeCheckIn = await prisma.gymCheckIn.findFirst({
      where: {
        userId: user.id,
        endedAt: null,
        endsAt: { gt: now },
      },
      include: { gym: { select: { id: true, name: true } } },
      orderBy: { startedAt: "desc" },
    });

    return json({
      ...user,
      visitCount,
      sendCount,
      linkedProviders,
      activeCheckIn: activeCheckIn
        ? {
            id: activeCheckIn.id,
            gymId: activeCheckIn.gym.id,
            gymName: activeCheckIn.gym.name,
            startedAt: activeCheckIn.startedAt,
            endsAt: activeCheckIn.endsAt,
          }
        : null,
    });
  } catch {
    return errorResponse("유저 정보를 불러올 수 없습니다.");
  }
};

/** 회원 탈퇴 */
export const DELETE = async () => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    /** Prisma 모델은 onDelete: Cascade이므로 유저 삭제 시 관련 데이터 자동 삭제 */
    await prisma.user.delete({ where: { id: userId! } });

    /** Supabase Auth 유저도 삭제 */
    const supabase = await createClient();
    await supabase.auth.admin.deleteUser(userId!);

    return jsonWithToast(null, "회원 탈퇴가 완료되었습니다.");
  } catch {
    return errorResponse("회원 탈퇴에 실패했습니다.");
  }
};

/** 내 정보 수정 */
export const PATCH = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = updateUserSchema.parse(body);

    if (data.nickname !== undefined) {
      const current = await prisma.user.findUnique({
        where: { id: userId! },
        select: { nickname: true },
      });
      if (
        current &&
        data.nickname !== current.nickname &&
        (await prisma.user.findFirst({
          where: { nickname: data.nickname, NOT: { id: userId! } },
          select: { id: true },
        }))
      ) {
        return errorResponse("이미 사용 중인 닉네임입니다.", 409);
      }
    }

    const normalized = {
      ...data,
      ...(data.bio !== undefined
        ? { bio: data.bio.trim() === "" ? null : data.bio.trim() }
        : {}),
    };

    const user = await prisma.user.update({
      where: { id: userId! },
      data: normalized,
    });

    return jsonWithToast(user, "프로필이 수정되었습니다.");
  } catch {
    return errorResponse("프로필 수정에 실패했습니다.");
  }
};
