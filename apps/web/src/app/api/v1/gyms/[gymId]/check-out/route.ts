import { prisma } from "@clog/db/prisma";

import { errorResponse, jsonWithToast, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { createSessionFromCheckInIfEligible } from "#web/libs/record/sessionFromCheckIn";
import { notifySlackCheckOut } from "#web/libs/slack/notifications";

/** 암장 체크아웃 (수동) */
export const POST = async (
  request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  const { gymId } = await params;
  const now = new Date();

  try {
    const [gym, user] = await Promise.all([
      prisma.gym.findUnique({
        where: { id: gymId },
        select: { id: true, name: true },
      }),
      prisma.user.findUnique({
        where: { id: userId! },
        select: { nickname: true },
      }),
    ]);
    if (!gym) return errorResponse("암장을 찾을 수 없습니다.", 404);
    if (!user) return errorResponse("유저를 찾을 수 없습니다.", 404);

    const { createdSessionId } = await prisma.$transaction(async (tx) => {
      const active = await tx.gymCheckIn.findFirst({
        where: {
          userId: userId!,
          gymId,
          endedAt: null,
          endsAt: { gt: now },
        },
        orderBy: { startedAt: "desc" },
      });

      if (!active) {
        throw new Error("NO_ACTIVE_CHECKIN");
      }

      const updated = await tx.gymCheckIn.update({
        where: { id: active.id },
        data: { endedAt: now },
      });

      const session = await createSessionFromCheckInIfEligible(tx, {
        checkInId: updated.id,
        userId: updated.userId,
        gymId: updated.gymId,
        startedAt: updated.startedAt,
        endedAt: updated.endedAt!,
      });

      return { createdSessionId: session?.id ?? null };
    });

    notifySlackCheckOut({
      nickname: user.nickname,
      userId: userId!,
      gymName: gym.name,
      gymId: gym.id,
      at: now,
    });

    return jsonWithToast({ ok: true, createdSessionId }, "체크아웃했어요.");
  } catch (error) {
    if (error instanceof Error && error.message === "NO_ACTIVE_CHECKIN") {
      return errorResponse("이 암장에서 활성 체크인이 없습니다.", 400);
    }
    return catchApiError(request, error, "체크아웃에 실패했습니다.", {
      userId: userId!,
    });
  }
};
