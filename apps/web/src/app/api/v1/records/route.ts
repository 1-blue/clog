import { prisma } from "@clog/db";
import { createSessionSchema, recordQuerySchema } from "@clog/utils";

import {
  errorResponse,
  getSearchParams,
  jsonWithToast,
  paginatedJson,
  requireAuth,
} from "#web/libs/api";
import { bumpUserMaxDifficultyFromRoutes } from "#web/libs/user/updateUserMaxDifficulty";

/** 기록 목록 (무한스크롤) */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const params = getSearchParams(request);
    const query = recordQuerySchema.parse(params);

    let dateFilter: { gte: Date; lt: Date } | undefined;
    if (query.month) {
      const [year, mon] = query.month.split("-").map(Number);
      dateFilter = {
        gte: new Date(year!, mon! - 1, 1),
        lt: new Date(year!, mon!, 1),
      };
    }

    const MONTH_LIMIT = 200;

    const sessions = await prisma.climbingSession.findMany({
      where: {
        userId: userId!,
        ...(dateFilter && { date: dateFilter }),
      },
      orderBy: { date: "desc" },
      take: dateFilter ? MONTH_LIMIT : query.limit + 1,
      ...(query.cursor &&
        !dateFilter && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        gym: {
          select: {
            id: true,
            name: true,
            difficultyColors: { orderBy: { order: "asc" } },
          },
        },
        routes: { orderBy: { order: "asc" } },
      },
    });

    const hasMore = dateFilter ? false : sessions.length > query.limit;
    const items = hasMore ? sessions.slice(0, query.limit) : sessions;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch {
    return errorResponse("기록을 불러올 수 없습니다.");
  }
};

/** 기록 생성 */
export const POST = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createSessionSchema.parse(body);

    const session = await prisma.climbingSession.create({
      data: {
        userId: userId!,
        gymId: data.gymId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        memo: data.memo,
        isPublic: data.isPublic,
        routes: {
          create: data.routes.map((r, i) => ({
            difficulty: r.difficulty,
            result: r.result,
            attempts: r.attempts,
            memo: r.memo,
            order: i,
          })),
        },
        imageUrls: data.imageUrls ?? [],
      },
      include: {
        routes: true,
      },
    });

    await bumpUserMaxDifficultyFromRoutes(userId!, session.routes);

    return jsonWithToast(session, "기록이 저장되었습니다.", 201);
  } catch {
    return errorResponse("기록 저장에 실패했습니다.");
  }
};
