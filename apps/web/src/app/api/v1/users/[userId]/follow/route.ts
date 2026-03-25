import { prisma } from "@clog/db";

import { errorResponse, json, requireAuth } from "#web/libs/api";

/** 팔로우 토글 */
export const POST = async (
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { userId: targetId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  if (userId === targetId) {
    return errorResponse("자기 자신을 팔로우할 수 없습니다.");
  }

  try {
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: userId!, followingId: targetId },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return json({ following: false });
    } else {
      await prisma.follow.create({
        data: { followerId: userId!, followingId: targetId },
      });
      return json({ following: true });
    }
  } catch {
    return errorResponse("팔로우 처리에 실패했습니다.");
  }
};
