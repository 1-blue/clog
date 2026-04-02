import { prisma } from "@clog/db";
import { commentQuerySchema, createCommentSchema } from "@clog/utils";

import {
  errorResponse,
  getSearchParams,
  jsonWithToast,
  paginatedJson,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 댓글 목록 (무한스크롤) */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;

  try {
    const searchParams = getSearchParams(request);
    const query = commentQuerySchema.parse(searchParams);

    const comments = await prisma.postComment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: "asc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: {
        author: { select: { id: true, nickname: true, profileImage: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, nickname: true, profileImage: true },
            },
          },
        },
      },
    });

    const hasMore = comments.length > query.limit;
    const items = hasMore ? comments.slice(0, query.limit) : comments;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch (error) {
    return catchApiError(request, error, "댓글을 불러올 수 없습니다.");
  }
};

/** 댓글 작성 */
export const POST = async (
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createCommentSchema.parse(body);

    const comment = await prisma.postComment.create({
      data: {
        postId,
        authorId: userId!,
        content: data.content,
        parentId: data.parentId,
      },
      include: {
        author: { select: { id: true, nickname: true, profileImage: true } },
      },
    });

    // 댓글 수 업데이트
    await prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    });

    return jsonWithToast(comment, "댓글이 등록되었습니다.", 201);
  } catch (error) {
    return catchApiError(request, error, "댓글 작성에 실패했습니다.", {
      userId: userId!,
    });
  }
};
