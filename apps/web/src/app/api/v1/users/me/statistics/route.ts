import type { ClimbingAttemptResult, Difficulty } from "@clog/db";
import { getDay, getHours } from "date-fns";
import { format } from "date-fns";

import { prisma } from "@clog/db";
import { meStatisticsQuerySchema } from "@clog/utils";

import { json, getSearchParams, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import {
  buildTrendBuckets,
  difficultyToLevel,
  formatRangeLabel,
  isSendLike,
  parseAnchor,
  resolvePreviousStatisticsRange,
  resolveStatisticsRange,
} from "#web/libs/statistics/meStatistics";
const ALL_DIFFICULTIES: Difficulty[] = [
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
];

const sendCountForSession = (
  routes: { result: ClimbingAttemptResult }[],
): number => routes.filter((r) => isSendLike(r.result)).length;

const avgDifficultySends = (
  routes: { result: ClimbingAttemptResult; difficulty: Difficulty }[],
): number | null => {
  const sends = routes.filter((r) => isSendLike(r.result));
  if (sends.length === 0) return null;
  const sum = sends.reduce((acc, r) => acc + difficultyToLevel(r.difficulty), 0);
  return sum / sends.length;
};

/** GET /api/v1/users/me/statistics */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const raw = getSearchParams(request);
    const query = meStatisticsQuerySchema.parse(raw);
    const anchor = parseAnchor(query.anchor);

    const firstSession = await prisma.climbingSession.findFirst({
      where: { userId: userId! },
      orderBy: { date: "asc" },
      select: { date: true },
    });
    const firstSessionDate = firstSession?.date ?? null;

    const currentRange = await resolveStatisticsRange({
      period: query.period,
      anchor,
      firstSessionDate,
    });

    const previousRange = resolvePreviousStatisticsRange({
      period: query.period,
      anchor,
      current: currentRange,
    });

    const [currentSessions, prevSessions] = await Promise.all([
      prisma.climbingSession.findMany({
        where: {
          userId: userId!,
          date: { gte: currentRange.start, lte: currentRange.end },
        },
        include: {
          gym: {
            select: {
              id: true,
              name: true,
              address: true,
              coverImageUrl: true,
            },
          },
          routes: { select: { difficulty: true, result: true } },
        },
      }),
      previousRange
        ? prisma.climbingSession.findMany({
            where: {
              userId: userId!,
              date: { gte: previousRange.start, lte: previousRange.end },
            },
            include: {
              routes: { select: { difficulty: true, result: true } },
            },
          })
        : Promise.resolve([]),
    ]);

    const totalSends = currentSessions.reduce(
      (acc, s) => acc + sendCountForSession(s.routes),
      0,
    );
    const prevTotalSends = prevSessions.reduce(
      (acc, s) => acc + sendCountForSession(s.routes),
      0,
    );

    let sendDeltaPercent: number | null = null;
    if (previousRange) {
      if (prevTotalSends === 0) {
        sendDeltaPercent = totalSends > 0 ? 100 : 0;
      } else {
        sendDeltaPercent = Math.round(
          ((totalSends - prevTotalSends) / prevTotalSends) * 100,
        );
      }
    }

    const gymIds = new Set(currentSessions.map((s) => s.gymId));
    let workoutMinutesTotal = 0;
    let workoutSessions = 0;
    for (const s of currentSessions) {
      if (s.startTime && s.endTime && s.endTime > s.startTime) {
        workoutMinutesTotal += Math.round(
          (s.endTime.getTime() - s.startTime.getTime()) / 60_000,
        );
        workoutSessions += 1;
      }
    }

    const allRoutes = currentSessions.flatMap((s) => s.routes);
    const attemptCount = allRoutes.filter((r) => r.result === "ATTEMPT").length;
    const sendRouteCount = allRoutes.filter((r) => isSendLike(r.result)).length;
    const totalRoutes = allRoutes.length;
    const sendAttemptPercent =
      totalRoutes === 0
        ? null
        : Math.round((sendRouteCount / totalRoutes) * 100);

    const diffCounts = new Map<Difficulty, number>();
    for (const d of ALL_DIFFICULTIES) diffCounts.set(d, 0);
    for (const r of allRoutes) {
      diffCounts.set(r.difficulty, (diffCounts.get(r.difficulty) ?? 0) + 1);
    }
    const difficultyDistribution = ALL_DIFFICULTIES.map((difficulty) => ({
      difficulty,
      count: diffCounts.get(difficulty) ?? 0,
    }));

    const sendsByBucketKey = new Map<string, number>();
    for (const s of currentSessions) {
      const dayKey = format(s.date, "yyyy-MM-dd");
      const sends = sendCountForSession(s.routes);
      if (sends === 0) continue;
      if (query.period === "year" || query.period === "all") {
        const monthKey = format(s.date, "yyyy-MM");
        sendsByBucketKey.set(
          monthKey,
          (sendsByBucketKey.get(monthKey) ?? 0) + sends,
        );
      } else {
        sendsByBucketKey.set(dayKey, (sendsByBucketKey.get(dayKey) ?? 0) + sends);
      }
    }

    const trendBuckets = buildTrendBuckets(
      query.period,
      currentRange,
      sendsByBucketKey,
    );
    let peakBucketKey: string | null = null;
    let peakSends = -1;
    for (const b of trendBuckets) {
      if (b.sends > peakSends) {
        peakSends = b.sends;
        peakBucketKey = b.key;
      }
    }
    if (peakSends <= 0) peakBucketKey = null;

    const gymVisitCount = new Map<
      string,
      {
        count: number;
        gym: {
          id: string;
          name: string;
          address: string;
          coverImageUrl: string;
        };
      }
    >();
    for (const s of currentSessions) {
      const g = s.gym;
      const cur = gymVisitCount.get(s.gymId);
      if (cur) {
        cur.count += 1;
      } else {
        gymVisitCount.set(s.gymId, { count: 1, gym: g });
      }
    }
    const topGyms = [...gymVisitCount.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(({ count, gym }) => ({
        gymId: gym.id,
        name: gym.name,
        address: gym.address,
        coverImageUrl: gym.coverImageUrl,
        visitCount: count,
      }));

    const insights = buildInsights({
      sessionsWithTime: currentSessions.filter(
        (s): s is typeof s & { startTime: Date } => Boolean(s.startTime),
      ),
      prevAvgSendDifficulty: prevSessions.length
        ? avgDifficultySends(prevSessions.flatMap((s) => s.routes))
        : null,
      currAvgSendDifficulty: avgDifficultySends(
        currentSessions.flatMap((s) => s.routes),
      ),
    });

    const rangeLabel = formatRangeLabel(
      query.period,
      currentRange.start,
      currentRange.end,
    );

    return json({
      period: query.period,
      anchor: format(anchor, "yyyy-MM-dd"),
      range: {
        start: currentRange.start.toISOString(),
        end: currentRange.end.toISOString(),
        label: rangeLabel,
      },
      previousRange: previousRange
        ? {
            start: previousRange.start.toISOString(),
            end: previousRange.end.toISOString(),
          }
        : null,
      kpis: {
        totalSends,
        sendDeltaPercent,
        uniqueGyms: gymIds.size,
        sessionCount: currentSessions.length,
        workoutMinutesTotal:
          workoutSessions > 0 ? workoutMinutesTotal : null,
      },
      trend: {
        buckets: trendBuckets,
        peakBucketKey,
      },
      difficultyDistribution,
      sendAttempt: {
        sendCount: sendRouteCount,
        attemptCount,
        totalRoutes,
        percent: sendAttemptPercent,
      },
      topGyms,
      insights,
    });
  } catch (err) {
    return catchApiError(request, err, "통계를 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};

function buildInsights(params: {
  sessionsWithTime: { startTime: Date }[];
  prevAvgSendDifficulty: number | null;
  currAvgSendDifficulty: number | null;
}): { variant: "primary" | "tertiary"; message: string }[] {
  const {
    prevAvgSendDifficulty,
    currAvgSendDifficulty,
    sessionsWithTime,
  } = params;
  const out: { variant: "primary" | "tertiary"; message: string }[] = [];

  if (
    prevAvgSendDifficulty !== null &&
    currAvgSendDifficulty !== null
  ) {
    const diff = currAvgSendDifficulty - prevAvgSendDifficulty;
    if (diff >= 0.4) {
      out.push({
        variant: "primary",
        message:
          "이전 기간보다 평균 완등 난이도가 올랐어요. 꾸준한 성장이에요!",
      });
    } else if (diff <= -0.4) {
      out.push({
        variant: "primary",
        message:
          "이전 기간보다 평균 완등 난이도가 조금 낮아졌어요. 재미 위주로 즐기셨나요?",
      });
    }
  }

  if (sessionsWithTime.length >= 3) {
    const slotCount = new Map<string, number>();
    for (const s of sessionsWithTime) {
      const t = s.startTime;
      const dow = getDay(t);
      const h = getHours(t);
      const key = `${dow}-${h}`;
      slotCount.set(key, (slotCount.get(key) ?? 0) + 1);
    }
    let bestKey: string | null = null;
    let best = 0;
    for (const [k, c] of slotCount) {
      if (c > best) {
        best = c;
        bestKey = k;
      }
    }
    if (bestKey) {
      const [dowStr, hStr] = bestKey.split("-");
      const dow = Number(dowStr);
      const hour = Number(hStr);
      const weekday = [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
      ][dow]!;
      const ampm = hour < 12 ? "오전" : "오후";
      const h12 = hour % 12 === 0 ? 12 : hour % 12;
      out.push({
        variant: "tertiary",
        message: `${weekday} ${ampm} ${h12}시에 기록이 가장 많아요.`,
      });
    }
  }

  return out.slice(0, 2);
}
