import { prisma } from "@clog/db";

import { errorResponse, getAuthUserId, json } from "#web/libs/api";
import { countActiveCheckInsForGym } from "#web/libs/gym/activeCheckInCount";

/** 암장 상세 (체크인 기준 실시간 인원, 로그인 시 내 체크인 상태 포함) */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { gymId } = await params;

  try {
    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      include: {
        images: { orderBy: { order: "asc" } },
        openHours: { orderBy: { dayType: "asc" } },
      },
    });

    if (!gym) return errorResponse("암장을 찾을 수 없습니다.", 404);

    const now = new Date();
    const liveVisitorCount = await countActiveCheckInsForGym(gymId);

    const userId = await getAuthUserId();
    let myCheckIn: { endsAt: string } | null = null;
    if (userId) {
      const row = await prisma.gymCheckIn.findFirst({
        where: {
          userId,
          gymId,
          endedAt: null,
          endsAt: { gt: now },
        },
        select: { endsAt: true },
      });
      if (row) myCheckIn = { endsAt: row.endsAt.toISOString() };
    }

    return json({
      ...gym,
      visitorCount: liveVisitorCount,
      myCheckIn,
    });
  } catch {
    return errorResponse("암장 정보를 불러올 수 없습니다.");
  }
};
