import { prisma } from "@clog/db";

import { errorResponse, jsonWithToast, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { notifySlackCheckIn } from "#web/libs/slack/notifications";

/** 암장 체크인 (다른 암장 활성 체크인은 자동 종료) */
export const POST = async (
  request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const { gymId } = await params;
  const now = new Date();

  try {
    const gym = await prisma.gym.findUnique({ where: { id: gymId } });
    if (!gym) return errorResponse("암장을 찾을 수 없습니다.", 404);

    const user = await prisma.user.findUnique({
      where: { id: userId! },
      select: { checkInAutoDurationMinutes: true, nickname: true },
    });
    if (!user) return errorResponse("유저를 찾을 수 없습니다.", 404);

    const durationMin = Math.min(
      720,
      Math.max(30, user.checkInAutoDurationMinutes),
    );
    const endsAt = new Date(now.getTime() + durationMin * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.gymCheckIn.updateMany({
        where: {
          userId: userId!,
          endedAt: null,
          endsAt: { gt: now },
        },
        data: { endedAt: now },
      });
      await tx.gymCheckIn.create({
        data: {
          userId: userId!,
          gymId,
          endsAt,
        },
      });
    });

    notifySlackCheckIn({
      nickname: user.nickname,
      userId: userId!,
      gymName: gym.name,
      gymId: gym.id,
      at: now,
      endsAt,
    });

    return jsonWithToast({ endsAt: endsAt.toISOString() }, "체크인했어요.");
  } catch (error) {
    return catchApiError(request, error, "체크인에 실패했습니다.", {
      userId: userId!,
    });
  }
};
