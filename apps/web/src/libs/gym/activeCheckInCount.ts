import { prisma } from "@clog/db";

/** 활성 체크인: 아직 종료되지 않았고 자동 체크아웃 시각이 아직 지나지 않음 */
export function activeCheckInWhere() {
  const now = new Date();
  return {
    endedAt: null,
    endsAt: { gt: now },
  };
}

export async function countActiveCheckInsForGym(
  gymId: string,
): Promise<number> {
  return prisma.gymCheckIn.count({
    where: { gymId, ...activeCheckInWhere() },
  });
}

export async function activeCheckInCountsForGymIds(
  gymIds: string[],
): Promise<Map<string, number>> {
  if (gymIds.length === 0) return new Map();
  const now = new Date();
  const rows = await prisma.gymCheckIn.groupBy({
    by: ["gymId"],
    where: {
      gymId: { in: gymIds },
      endedAt: null,
      endsAt: { gt: now },
    },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.gymId, r._count._all]));
}
