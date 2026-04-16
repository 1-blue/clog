import { z } from "zod";

import { prisma } from "@clog/db/prisma";

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

const postInclude = {
  author: { select: { id: true, nickname: true, profileImage: true } },
} as const;

/** 내가 북마크한 게시글 (최근 저장 순) */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const params = getSearchParams(request);
    const query = querySchema.parse(params);

    const rows = await prisma.postBookmark.findMany({
      where: { userId: userId! },
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: { post: { include: postInclude } },
    });

    const hasMore = rows.length > query.limit;
    const slice = hasMore ? rows.slice(0, query.limit) : rows;
    const items = slice.map((r) => r.post);
    const nextCursor = hasMore ? slice[slice.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch (error) {
    return catchApiError(request, error, "저장한 글을 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};
