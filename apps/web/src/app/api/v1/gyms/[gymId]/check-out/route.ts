import { prisma } from "@clog/db";

import { errorResponse, jsonWithToast, requireAuth } from "#web/libs/api";
import { notifySlackCheckOut } from "#web/libs/slack/notifications";

/** 암장 체크아웃 (수동) */
export const POST = async (
  _request: Request,
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

    const result = await prisma.gymCheckIn.updateMany({
      where: {
        userId: userId!,
        gymId,
        endedAt: null,
        endsAt: { gt: now },
      },
      data: { endedAt: now },
    });

    if (result.count === 0) {
      return errorResponse("이 암장에서 활성 체크인이 없습니다.", 400);
    }

    notifySlackCheckOut({
      nickname: user.nickname,
      userId: userId!,
      gymName: gym.name,
      gymId: gym.id,
      at: now,
    });

    return jsonWithToast({ ok: true }, "체크아웃했어요.");
  } catch {
    return errorResponse("체크아웃에 실패했습니다.");
  }
};
