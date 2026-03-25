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

    const orderBy = {
      name: { name: "asc" as const },
      rating: { avgRating: "desc" as const },
      congestion: { congestion: "desc" as const },
      reviewCount: { reviewCount: "desc" as const },
    }[query.sort ?? "name"];

    const gyms = await prisma.gym.findMany({
      where,
      orderBy,
      take: query.limit + 1,
      ...(query.cursor && {
        cursor: { id: query.cursor },
        skip: 1,
      }),
      include: {
        facilities: true,
        images: { take: 1, orderBy: { order: "asc" } },
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
