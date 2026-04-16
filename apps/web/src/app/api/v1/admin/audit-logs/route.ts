import { auditLogQuerySchema } from "@clog/contracts";
import type { Prisma } from "@clog/db";
import { prisma } from "@clog/db/prisma";

import { getSearchParams, paginatedJson, requireAdmin } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 어드민 — 감사 로그 목록 */
export const GET = async (request: Request) => {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const params = getSearchParams(request);
    const query = auditLogQuerySchema.parse(params);

    const where: Prisma.AdminAuditLogWhereInput = {
      ...(query.actorId && { actorId: query.actorId }),
      ...(query.action && { action: query.action }),
      ...(query.targetType && { targetType: query.targetType }),
      ...((query.from || query.to) && {
        createdAt: {
          ...(query.from ? { gte: new Date(query.from) } : {}),
          ...(query.to ? { lte: new Date(query.to) } : {}),
        },
      }),
    };

    const rows = await prisma.adminAuditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        actor: { select: { id: true, nickname: true, email: true } },
      },
    });

    const hasMore = rows.length > query.limit;
    const items = hasMore ? rows.slice(0, query.limit) : rows;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;
    return paginatedJson(items, nextCursor);
  } catch (e) {
    return catchApiError(request, e, "감사 로그를 불러올 수 없습니다.");
  }
};
