import { prisma } from "@clog/db";
import { notificationQuerySchema } from "@clog/utils";

import {
  errorResponse,
  getSearchParams,
  paginatedJson,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 알림 목록 (무한스크롤) */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const params = getSearchParams(request);
    const query = notificationQuerySchema.parse(params);

    const where = {
      userId: userId!,
      ...(query.type && { type: query.type }),
    };

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
    });

    const hasMore = notifications.length > query.limit;
    const items = hasMore ? notifications.slice(0, query.limit) : notifications;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch (error) {
    return catchApiError(request, error, "알림을 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};
