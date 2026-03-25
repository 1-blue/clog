import { addDays, format, startOfDay, subDays } from "date-fns";

import { prisma } from "@clog/db";

export type ProfileStatsScope = "owner" | "public";

function sessionWhereForScope(
  userId: string,
  scope: ProfileStatsScope,
): { userId: string; isPublic?: boolean } {
  return scope === "owner" ? { userId } : { userId, isPublic: true };
}

/** 방문한 서로 다른 암장 수 */
export async function getUserVisitCount(
  userId: string,
  scope: ProfileStatsScope,
): Promise<number> {
  const grouped = await prisma.climbingSession.groupBy({
    by: ["gymId"],
    where: sessionWhereForScope(userId, scope),
  });
  return grouped.length;
}

/** 완등(SEND) 누적 횟수 */
export async function getUserSendCount(
  userId: string,
  scope: ProfileStatsScope,
): Promise<number> {
  return prisma.climbingRoute.count({
    where: {
      result: "SEND",
      session: sessionWhereForScope(userId, scope),
    },
  });
}

export async function getUserProfileStats(
  userId: string,
  scope: ProfileStatsScope,
): Promise<{ visitCount: number; sendCount: number }> {
  const [visitCount, sendCount] = await Promise.all([
    getUserVisitCount(userId, scope),
    getUserSendCount(userId, scope),
  ]);
  return { visitCount, sendCount };
}

/**
 * 최근 N주 × 7일 히트맵 (컬럼 우선: 각 주의 월~일)
 * levels 0~4 — 공개 세션만 집계, dayKeys는 각 셀의 yyyy-MM-dd
 */
export async function getUserActivityHeatmap(
  userId: string,
  weeks = 20,
): Promise<{ levels: number[]; dayKeys: string[] }> {
  const totalDays = weeks * 7;
  const end = startOfDay(new Date());
  const start = subDays(end, totalDays - 1);

  const sessions = await prisma.climbingSession.findMany({
    where: {
      userId,
      isPublic: true,
      date: { gte: start, lte: end },
    },
    select: { date: true },
  });

  const countByDay = new Map<string, number>();
  for (const s of sessions) {
    const key = format(startOfDay(s.date), "yyyy-MM-dd");
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
  }

  const levels: number[] = [];
  const dayKeys: string[] = [];
  for (let col = 0; col < weeks; col++) {
    for (let row = 0; row < 7; row++) {
      const day = addDays(start, col * 7 + row);
      const key = format(day, "yyyy-MM-dd");
      dayKeys.push(key);
      const n = countByDay.get(key) ?? 0;
      const level = n === 0 ? 0 : n === 1 ? 1 : n <= 2 ? 2 : n <= 4 ? 3 : 4;
      levels.push(level);
    }
  }
  return { levels, dayKeys };
}
