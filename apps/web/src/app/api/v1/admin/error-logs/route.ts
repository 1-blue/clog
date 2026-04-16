import { errorLogQuerySchema } from "@clog/contracts";
import type { Prisma } from "@clog/db";
import { prisma } from "@clog/db/prisma";

import { getSearchParams, paginatedJson, requireAdmin } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 어드민 — 에러 로그 목록 */
export const GET = async (request: Request) => {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const params = getSearchParams(request);
    const query = errorLogQuerySchema.parse(params);

    const where: Prisma.ApiErrorLogWhereInput = {
      ...(query.method && { method: query.method }),
      ...(query.httpStatus != null && { httpStatus: query.httpStatus }),
      ...(query.endpoint && {
        endpoint: { contains: query.endpoint, mode: "insensitive" },
      }),
      ...((query.from || query.to) && {
        createdAt: {
          ...(query.from ? { gte: new Date(query.from) } : {}),
          ...(query.to ? { lte: new Date(query.to) } : {}),
        },
      }),
    };

    const rows = await prisma.apiErrorLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
    });

    const hasMore = rows.length > query.limit;
    const items = hasMore ? rows.slice(0, query.limit) : rows;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;
    return paginatedJson(items, nextCursor);
  } catch (e) {
    return catchApiError(request, e, "에러 로그를 불러올 수 없습니다.");
  }
};
