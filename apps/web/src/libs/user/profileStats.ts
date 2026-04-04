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
import { Prisma } from "@prisma/client";

export type ProfileStatsScope = "owner" | "public";

/** 히트맵 집계 시작일 (로컬 자정 기준 2026-01-01) */
const HEATMAP_START = startOfDay(new Date(2026, 0, 1));

/**
 * 방문 암장 수 + 완등(SEND) 횟수를 단일 raw SQL로 조회.
 * - visitCount: COUNT(DISTINCT gym_id) — 기존 groupBy → .length 대체
 * - sendCount: 서브쿼리로 routes 테이블 JOIN 없이 집계
 */
export const getUserProfileStats = async (
  userId: string,
  scope: ProfileStatsScope,
): Promise<{ visitCount: number; sendCount: number }> => {
  const isPublicFilter =
    scope === "public" ? Prisma.sql`AND s.is_public = true` : Prisma.empty;

  const rows = await prisma.$queryRaw<
    [{ visit_count: bigint; send_count: bigint }]
  >(Prisma.sql`
    SELECT
      COUNT(DISTINCT s.gym_id)::bigint AS visit_count,
      COALESCE(SUM(
        (SELECT COUNT(*)::bigint FROM routes r WHERE r.session_id = s.id AND r.result = 'SEND')
      ), 0)::bigint AS send_count
    FROM climbing_sessions s
    WHERE s.user_id = ${userId}::uuid
      ${isPublicFilter}
  `);

  const row = rows[0]!;
  return {
    visitCount: Number(row.visit_count),
    sendCount: Number(row.send_count),
  };
};

export type TActivityHeatmapResult = {
  levels: number[];
  dayKeys: string[];
  /** HEATMAP_START ~ 오늘 사이 공개 세션 총 개수 */
  publicSessionCountInRange: number;
};

/**
 * 2026-01-01 ~ 오늘, 월요일 시작 주 단위 그리드 (열=주, 행=월~일).
 * levels 0~4 — 공개 세션만 집계, dayKeys는 각 셀 yyyy-MM-dd.
 * DB에서 날짜별 세션 수만 집계하여 메모리 사용 최소화.
 */
export const getUserActivityHeatmap = async (
  userId: string,
): Promise<TActivityHeatmapResult> => {
  const today = startOfDay(new Date());

  if (isBefore(today, HEATMAP_START)) {
    return { levels: [], dayKeys: [], publicSessionCountInRange: 0 };
  }

  const gridStart = startOfWeek(HEATMAP_START, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(today, { weekStartsOn: 1 });

  const dayList = eachDayOfInterval({ start: gridStart, end: gridEnd });

  /** DB에서 날짜별 세션 수만 집계 (전체 row를 가져오지 않음) */
  const rows = await prisma.$queryRaw<{ d: Date; cnt: bigint }[]>(Prisma.sql`
    SELECT date AS d, COUNT(*)::bigint AS cnt
    FROM climbing_sessions
    WHERE user_id = ${userId}::uuid
      AND is_public = true
      AND date >= ${HEATMAP_START}
      AND date <= ${today}
    GROUP BY date
  `);

  const countByDay = new Map<string, number>();
  let publicSessionCountInRange = 0;
  for (const row of rows) {
    const key = format(startOfDay(row.d), "yyyy-MM-dd");
    const n = Number(row.cnt);
    countByDay.set(key, n);
    publicSessionCountInRange += n;
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
};
