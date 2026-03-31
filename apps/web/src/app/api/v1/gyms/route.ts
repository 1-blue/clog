import { prisma } from "@clog/db";
import { gymQuerySchema } from "@clog/utils";

import { errorResponse, getSearchParams, paginatedJson } from "#web/libs/api";
import { activeCheckInCountsForGymIds } from "#web/libs/gym/activeCheckInCount";

/** 암장 목록 (검색/지역필터/정렬/무한스크롤) */
export const GET = async (request: Request) => {
  try {
    const params = getSearchParams(request);
    const query = gymQuerySchema.parse(params);

    const where = {
      ...(query.region && { region: query.region }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: "insensitive" as const } },
          { address: { contains: query.search, mode: "insensitive" as const } },
        ],
      }),
    };

    if (query.sort === "monthlyCheckInCount") {
      // Asia/Seoul 고정 오프셋(+09:00, DST 없음) 기준 월 경계 계산
      const SEOUl_OFFSET_HOURS = 9;
      const offsetMs = SEOUl_OFFSET_HOURS * 60 * 60 * 1000;

      const getSeoulYearMonth = (
        at: Date,
      ): { year: number; monthIndex: number } => {
        const fmt = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "2-digit",
        });
        const parts = fmt.formatToParts(at);
        const yearStr = parts.find((p) => p.type === "year")?.value;
        const monthStr = parts.find((p) => p.type === "month")?.value;
        const year = Number(yearStr);
        const month = Number(monthStr);
        return { year, monthIndex: month - 1 };
      };

      const now = new Date();
      const { year, monthIndex } = getSeoulYearMonth(now);

      const monthStartUtc = Date.UTC(year, monthIndex, 1, 0, 0, 0) - offsetMs;
      const nextMonthStartUtc =
        Date.UTC(year, monthIndex + 1, 1, 0, 0, 0) - offsetMs;
      const monthStart = new Date(monthStartUtc);
      const nextMonthStart = new Date(nextMonthStartUtc);

      // 범위(region/search)에 해당하는 gym 전체를 대상으로 월간 체크인 횟수를 집계합니다.
      const candidateRows = await prisma.gym.findMany({
        where,
        select: { id: true },
      });
      const allIds = candidateRows.map((r) => r.id);
      if (allIds.length === 0) return paginatedJson([], null);

      // 체크인~체크아웃(또는 진행중 now-startedAt)이 30분 이상인 세션만 집계
      // - ended_at이 있으면 ended_at - started_at >= 30분
      // - ended_at이 없으면 started_at <= now - 30분
      const minDurationStart = new Date(Date.now() - 30 * 60 * 1000);

      const counts = await prisma.$queryRaw<
        Array<{ gymId: string; checkInCount: number }>
      >`
        SELECT
          "gym_id" AS "gymId",
          COUNT(*)::int AS "checkInCount"
        FROM "gym_check_ins"
        WHERE "gym_id" = ANY(${allIds}::uuid[])
          AND "started_at" >= ${monthStart}
          AND "started_at" < ${nextMonthStart}
          AND (
            ("ended_at" IS NOT NULL AND "ended_at" - "started_at" >= interval '30 minutes')
            OR ("ended_at" IS NULL AND "started_at" <= ${minDurationStart})
          )
        GROUP BY "gym_id"
      `;

      const countByGymId = new Map(
        counts.map((r) => [r.gymId, r.checkInCount] as const),
      );

      const sorted = allIds
        .map((id) => ({
          id,
          checkInCount: countByGymId.get(id) ?? 0,
        }))
        .sort((a, b) => {
          if (b.checkInCount !== a.checkInCount)
            return b.checkInCount - a.checkInCount;
          return a.id.localeCompare(b.id);
        });

      const startIndex =
        query.cursor == null
          ? 0
          : Math.max(0, sorted.findIndex((s) => s.id === query.cursor) + 1);

      const page = sorted.slice(startIndex, startIndex + query.limit + 1);
      const hasMore = page.length > query.limit;
      const pageItems = hasMore ? page.slice(0, query.limit) : page;
      const nextCursor = hasMore ? pageItems[pageItems.length - 1]!.id : null;

      const pageIds = pageItems.map((p) => p.id);
      if (pageIds.length === 0) return paginatedJson([], null);

      const gyms = await prisma.gym.findMany({
        where: { id: { in: pageIds } },
        include: {
          images: { take: 1, orderBy: { order: "asc" } },
        },
      });

      const liveCounts = await activeCheckInCountsForGymIds(pageIds);
      const gymById = new Map(gyms.map((g) => [g.id, g]));

      const withLive = pageIds
        .map((id) => {
          const g = gymById.get(id);
          if (!g) return null;
          return {
            ...g,
            visitorCount: liveCounts.get(id) ?? 0,
            monthlyCheckInCount: countByGymId.get(id) ?? 0,
          };
        })
        .filter((v) => v != null) as Array<
        (typeof gyms)[number] & { visitorCount: number }
      >;

      return paginatedJson(withLive, nextCursor);
    }

    // MVP: visitorCount 정렬은 DB orderBy가 아니라 “실시간 활성 체크인” 집계를 기반으로 정렬합니다.
    if (query.sort === "visitorCount") {
      const candidateRows = await prisma.gym.findMany({
        where,
        select: { id: true },
      });

      const allIds = candidateRows.map((r) => r.id);
      const counts = await activeCheckInCountsForGymIds(allIds);

      const sorted = candidateRows
        .map((r) => ({
          id: r.id,
          visitorCount: counts.get(r.id) ?? 0,
        }))
        .sort((a, b) => {
          if (b.visitorCount !== a.visitorCount)
            return b.visitorCount - a.visitorCount;
          // 동률이면 결정적 정렬을 위해 id 오름차순
          return a.id.localeCompare(b.id);
        });

      const startIndex =
        query.cursor == null
          ? 0
          : Math.max(0, sorted.findIndex((s) => s.id === query.cursor) + 1);

      const page = sorted.slice(startIndex, startIndex + query.limit + 1);
      const hasMore = page.length > query.limit;
      const pageItems = hasMore ? page.slice(0, query.limit) : page;
      const nextCursor = hasMore ? pageItems[pageItems.length - 1]!.id : null;

      const pageIds = pageItems.map((p) => p.id);
      if (pageIds.length === 0) return paginatedJson([], null);

      const gyms = await prisma.gym.findMany({
        where: { id: { in: pageIds } },
        include: {
          images: { take: 1, orderBy: { order: "asc" } },
        },
      });

      const gymById = new Map(gyms.map((g) => [g.id, g]));
      const withLive = pageIds
        .map((id) => {
          const g = gymById.get(id);
          if (!g) return null;
          return {
            ...g,
            visitorCount: counts.get(id) ?? 0,
          };
        })
        .filter((v) => v != null) as Array<
        (typeof gyms)[number] & { visitorCount: number }
      >;

      return paginatedJson(withLive, nextCursor);
    }

    const orderBy = (() => {
      switch (query.sort) {
        case "rating":
          return { avgRating: "desc" as const };
        case "congestion":
          return { congestion: "desc" as const };
        case "reviewCount":
          return { reviewCount: "desc" as const };
        case "name":
        default:
          return { name: "asc" as const };
      }
    })();

    const gyms = await prisma.gym.findMany({
      where,
      orderBy,
      take: query.limit + 1,
      ...(query.cursor && {
        cursor: { id: query.cursor },
        skip: 1,
      }),
      include: {
        images: { take: 1, orderBy: { order: "asc" } },
        openHours: true,
      },
    });

    const hasMore = gyms.length > query.limit;
    const items = hasMore ? gyms.slice(0, query.limit) : gyms;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    const counts = await activeCheckInCountsForGymIds(items.map((g) => g.id));
    const withLive = items.map((g) => ({
      ...g,
      visitorCount: counts.get(g.id) ?? 0,
    }));

    return paginatedJson(withLive, nextCursor);
  } catch {
    return errorResponse("암장 목록을 불러올 수 없습니다.");
  }
};
