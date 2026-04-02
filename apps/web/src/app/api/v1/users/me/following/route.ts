import { prisma } from "@clog/db";
import { z } from "zod";

import {
  errorResponse,
  getSearchParams,
  paginatedJson,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

const querySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

/** 내 팔로잉 목록 */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const params = getSearchParams(request);
    const query = querySchema.parse(params);

    const rows = await prisma.follow.findMany({
      where: { followerId: userId! },
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        following: { select: { id: true, nickname: true, profileImage: true } },
      },
    });

    const hasMore = rows.length > query.limit;
    const slice = hasMore ? rows.slice(0, query.limit) : rows;
    const items = slice.map((r) => r.following);
    const nextCursor = hasMore ? slice[slice.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch (error) {
    return catchApiError(request, error, "팔로잉 목록을 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};
