import { prisma } from "@clog/db";

import { errorResponse, json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 좋아요 토글 */
export const POST = async (
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId: userId! } },
    });

    if (existing) {
      await prisma.postLike.delete({ where: { id: existing.id } });
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      });
      return json({ liked: false });
    } else {
      await prisma.postLike.create({ data: { postId, userId: userId! } });
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });
      return json({ liked: true });
    }
  } catch (error) {
    return catchApiError(request, error, "좋아요 처리에 실패했습니다.", {
      userId: userId!,
    });
  }
};
