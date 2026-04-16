import { z } from "zod";

import { prisma } from "@clog/db/prisma";

import { errorResponse, getSearchParams, paginatedJson } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

const querySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

/** 특정 유저의 팔로잉 목록 */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { userId: targetId } = await params;

  try {
    const exists = await prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true },
    });
    if (!exists) return errorResponse("유저를 찾을 수 없습니다.", 404);

    const paramsQuery = getSearchParams(request);
    const query = querySchema.parse(paramsQuery);

    const rows = await prisma.follow.findMany({
      where: { followerId: targetId },
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
    return catchApiError(request, error, "팔로잉 목록을 불러올 수 없습니다.");
  }
};
