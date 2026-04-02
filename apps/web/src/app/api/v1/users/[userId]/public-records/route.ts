import { prisma } from "@clog/db";
import { recordQuerySchema } from "@clog/utils";

import { errorResponse, getSearchParams, paginatedJson } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 타인 프로필용 공개 기록 목록 (무한스크롤) */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { userId } = await params;

  try {
    const exists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!exists) return errorResponse("유저를 찾을 수 없습니다.", 404);

    const raw = getSearchParams(request);
    const query = recordQuerySchema.parse(raw);

    const sessions = await prisma.climbingSession.findMany({
      where: {
        userId,
        isPublic: true,
        ...(query.day && { date: new Date(`${query.day}T00:00:00.000Z`) }),
      },
      orderBy: { date: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        gym: { select: { id: true, name: true } },
        routes: { orderBy: { order: "asc" } },
      },
    });

    const hasMore = sessions.length > query.limit;
    const items = hasMore ? sessions.slice(0, query.limit) : sessions;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch (error) {
    return catchApiError(request, error, "기록을 불러올 수 없습니다.");
  }
};
