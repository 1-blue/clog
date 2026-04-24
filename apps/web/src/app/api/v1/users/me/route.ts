import { NextResponse } from "next/server";

import { updateUserSchema } from "@clog/contracts";
import { prisma } from "@clog/db/prisma";

import {
  errorResponse,
  getAuthUserId,
  json,
  jsonWithToast,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { getLinkedProvidersForUserId } from "#web/libs/auth/linkedProviders";
import { closeExpiredCheckInsAndNotify } from "#web/libs/gym/closeExpiredCheckInsAndNotify";
import { notifySlackUserWithdrawal } from "#web/libs/slack/notifications";
import { getUserProfileStats } from "#web/libs/user/profileStats";

const meInclude = {
  _count: {
    select: { following: true, followers: true, climbingSessions: true },
  },
  homeGym: { select: { id: true, name: true } },
} as const;

/** 내 정보 — 비로그인 시에도 200 + payload: null (네트워크/401 없이 게스트 처리) */
export const GET = async (request: Request) => {
  const userId = await getAuthUserId();
  if (!userId) {
    return json(null);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: meInclude,
    });

    if (!user) {
      const res = NextResponse.json(
        { toast: "세션이 유효하지 않습니다. 다시 로그인해 주세요.", payload: null },
        { status: 200 },
      );
      res.headers.set("x-clog-ghost-session", "1");
      return res;
    }

    const { visitCount, sendCount } = await getUserProfileStats(
      user.id,
      "owner",
    );

    const linkedProviders = await getLinkedProvidersForUserId(user.id);

    await closeExpiredCheckInsAndNotify(user.id);

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

    const { _count, ...rest } = user;

    return json({
      ...rest,
      _count: {
        following: _count.following,
        followers: _count.followers,
        sessions: _count.climbingSessions,
      },
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
  } catch (err) {
    return catchApiError(request, err, "유저 정보를 불러올 수 없습니다.", {
      userId,
    });
  }
};

/** 회원 탈퇴 */
export const DELETE = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const prismaUser = await prisma.user.findUnique({
      where: { id: userId! },
      select: { nickname: true, email: true },
    });
    if (!prismaUser) return errorResponse("유저를 찾을 수 없습니다.", 404);

    const providers = await getLinkedProvidersForUserId(userId!);

    /** Prisma 모델은 onDelete: Cascade이므로 유저 삭제 시 관련 데이터 자동 삭제 */
    await prisma.user.delete({ where: { id: userId! } });

    notifySlackUserWithdrawal({
      nickname: prismaUser.nickname,
      userId: userId!,
      email: prismaUser.email,
      providers,
    });

    return jsonWithToast(null, "회원 탈퇴가 완료되었습니다.");
  } catch (err) {
    return catchApiError(request, err, "회원 탈퇴에 실패했습니다.", {
      userId: userId!,
    });
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

    if (data.homeGymId !== undefined && data.homeGymId !== null) {
      const gym = await prisma.gym.findUnique({
        where: { id: data.homeGymId },
        select: { id: true },
      });
      if (!gym) {
        return errorResponse("암장을 찾을 수 없습니다.", 404);
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
      include: { homeGym: { select: { id: true, name: true } } },
    });

    return jsonWithToast(user, "프로필이 수정되었습니다.");
  } catch (err) {
    return catchApiError(request, err, "프로필 수정에 실패했습니다.", {
      userId: userId!,
    });
  }
};
