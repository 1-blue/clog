import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  startOfDay,
  startOfWeek,
} from "date-fns";

import { prisma } from "@clog/db";

export type ProfileStatsScope = "owner" | "public";

/** 히트맵 집계 시작일 (로컬 자정 기준 2026-01-01) */
const HEATMAP_START = startOfDay(new Date(2026, 0, 1));

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

export type TActivityHeatmapResult = {
  levels: number[];
  dayKeys: string[];
  /** HEATMAP_START ~ 오늘 사이 공개 세션 총 개수 */
  publicSessionCountInRange: number;
};

/**
 * 2026-01-01 ~ 오늘, 월요일 시작 주 단위 그리드 (열=주, 행=월~일).
 * levels 0~4 — 공개 세션만 집계, dayKeys는 각 셀 yyyy-MM-dd
 */
export async function getUserActivityHeatmap(
  userId: string,
): Promise<TActivityHeatmapResult> {
  const today = startOfDay(new Date());

  if (isBefore(today, HEATMAP_START)) {
    return { levels: [], dayKeys: [], publicSessionCountInRange: 0 };
  }

  const gridStart = startOfWeek(HEATMAP_START, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(today, { weekStartsOn: 1 });

  const dayList = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const sessions = await prisma.climbingSession.findMany({
    where: {
      userId,
      isPublic: true,
      date: { gte: HEATMAP_START, lte: today },
    },
    select: { date: true },
  });

  const publicSessionCountInRange = sessions.length;

  const countByDay = new Map<string, number>();
  for (const s of sessions) {
    const key = format(startOfDay(s.date), "yyyy-MM-dd");
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
  }

  const levels: number[] = [];
  const dayKeys: string[] = [];

  for (const day of dayList) {
    const key = format(day, "yyyy-MM-dd");
    dayKeys.push(key);

    if (isBefore(day, HEATMAP_START) || isAfter(day, today)) {
      levels.push(0);
      continue;
    }

    const n = countByDay.get(key) ?? 0;
    const level = n === 0 ? 0 : n === 1 ? 1 : n <= 2 ? 2 : n <= 4 ? 3 : 4;
    levels.push(level);
  }

  return { levels, dayKeys, publicSessionCountInRange };
}
