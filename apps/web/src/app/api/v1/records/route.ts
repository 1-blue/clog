import { prisma } from "@clog/db";
import { createSessionSchema, recordQuerySchema } from "@clog/utils";

import {
  errorResponse,
  getSearchParams,
  jsonWithToast,
  paginatedJson,
  requireAuth,
} from "#web/libs/api";

/** 기록 목록 (무한스크롤) */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const params = getSearchParams(request);
    const query = recordQuerySchema.parse(params);

    const sessions = await prisma.climbingSession.findMany({
      where: { userId: userId! },
      orderBy: { date: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        gym: { select: { id: true, name: true } },
        routes: { orderBy: { order: "asc" } },
        images: { orderBy: { order: "asc" }, take: 1 },
      },
    });

    const hasMore = sessions.length > query.limit;
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
        images: data.imageUrls?.length
          ? { create: data.imageUrls.map((url, i) => ({ url, order: i })) }
          : undefined,
      },
      include: {
        routes: true,
        images: true,
      },
    });

    return jsonWithToast(session, "기록이 저장되었습니다.", 201);
  } catch {
    return errorResponse("기록 저장에 실패했습니다.");
  }
};
