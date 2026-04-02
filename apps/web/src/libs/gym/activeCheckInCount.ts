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

const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000;

const getSeoulMonthBounds = (
  at: Date,
): { monthStart: Date; nextMonthStart: Date } => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
  });
  const parts = fmt.formatToParts(at);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const monthIndex = month - 1;

  const monthStartUtc = Date.UTC(year, monthIndex, 1, 0, 0, 0) - SEOUL_OFFSET_MS;
  const nextMonthStartUtc =
    Date.UTC(year, monthIndex + 1, 1, 0, 0, 0) - SEOUL_OFFSET_MS;

  return {
    monthStart: new Date(monthStartUtc),
    nextMonthStart: new Date(nextMonthStartUtc),
  };
};

/**
 * 이번 달(서울) 체크인 횟수 — 월 경계는 Asia/Seoul
 * (`GET /api/v1/gyms?sort=monthlyCheckInCount` 집계 규칙과 동일)
 */
export async function monthlyQualifiedCheckInCountForGym(
  gymId: string,
): Promise<number> {
  const { monthStart, nextMonthStart } = getSeoulMonthBounds(new Date());

  const rows = await prisma.$queryRaw<Array<{ c: number }>>`
    SELECT COUNT(*)::int AS c
    FROM "gym_check_ins"
    WHERE "gym_id" = ${gymId}::uuid
      AND "started_at" >= ${monthStart}
      AND "started_at" < ${nextMonthStart}
  `;

  return rows[0]?.c ?? 0;
}
