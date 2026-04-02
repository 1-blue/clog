import { prisma } from "@clog/db";

import { errorResponse, json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 북마크 토글 */
export const POST = async (
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) => {
  const { postId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.postBookmark.findUnique({
      where: { postId_userId: { postId, userId: userId! } },
    });

    if (existing) {
      await prisma.postBookmark.delete({ where: { id: existing.id } });
      return json({ bookmarked: false });
    } else {
      await prisma.postBookmark.create({ data: { postId, userId: userId! } });
      return json({ bookmarked: true });
    }
  } catch (error) {
    return catchApiError(request, error, "북마크 처리에 실패했습니다.", {
      userId: userId!,
    });
  }
};
