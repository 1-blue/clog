import { prisma } from "@clog/db";
import { z } from "zod";

import { errorResponse, getSearchParams, paginatedJson } from "#web/libs/api";

const querySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

/** 특정 유저의 팔로워 목록 */
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
      where: { followingId: targetId },
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        follower: { select: { id: true, nickname: true, profileImage: true } },
      },
    });

    const hasMore = rows.length > query.limit;
    const slice = hasMore ? rows.slice(0, query.limit) : rows;
    const items = slice.map((r) => r.follower);
    const nextCursor = hasMore ? slice[slice.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch {
    return errorResponse("팔로워 목록을 불러올 수 없습니다.");
  }
};
