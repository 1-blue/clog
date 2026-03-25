import { prisma } from "@clog/db";

import { errorResponse, jsonWithToast, requireAuth } from "#web/libs/api";

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

    return jsonWithToast({ ok: true }, "체크아웃했어요.");
  } catch {
    return errorResponse("체크아웃에 실패했습니다.");
  }
};
