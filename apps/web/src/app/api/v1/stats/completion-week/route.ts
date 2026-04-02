import { prisma } from "@clog/db";

import { json } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 최근 7일 일별 완등(시도 제외 루트) 합계 — 홈 차트용 */
export const GET = async (request: Request) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const sessions = await prisma.climbingSession.findMany({
      where: { date: { gte: start } },
      select: {
        date: true,
        routes: { select: { result: true } },
      },
    });

    const keys: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      keys.push(d.toISOString().split("T")[0]!);
    }

    const counts = new Map<string, number>(keys.map((k) => [k, 0]));

    for (const s of sessions) {
      const key = s.date.toISOString().split("T")[0]!;
      const sends = s.routes.filter((r) => r.result !== "ATTEMPT").length;
      if (sends === 0) continue;
      counts.set(key, (counts.get(key) ?? 0) + sends);
    }

    const points = keys.map((date) => ({
      date,
      count: counts.get(date) ?? 0,
    }));

    return json({ points });
  } catch (error) {
    return catchApiError(request, error, "통계를 불러올 수 없습니다.");
  }
};
