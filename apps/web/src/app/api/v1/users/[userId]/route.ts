import { prisma } from "@clog/db";

import { errorResponse, getAuthUserId, json } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import {
  getUserActivityHeatmap,
  getUserProfileStats,
} from "#web/libs/user/profileStats";

/** 유저 프로필 */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { userId } = await params;

  try {
    const currentUserId = await getAuthUserId();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        homeGymId: true,
        nickname: true,
        bio: true,
        profileImage: true,
        coverImage: true,
        instagramId: true,
        youtubeUrl: true,
        maxDifficulty: true,
        createdAt: true,
        homeGym: { select: { id: true, name: true } },
        _count: {
          select: { following: true, followers: true, sessions: true },
        },
        ...(currentUserId && {
          followers: {
            where: { followerId: currentUserId },
            select: { id: true },
          },
        }),
      },
    });

    if (!user) return errorResponse("유저를 찾을 수 없습니다.", 404);

    const scope =
      currentUserId && currentUserId === userId ? "owner" : "public";
    const { visitCount, sendCount } = await getUserProfileStats(
      userId,
      scope,
    );
    const {
      levels: activityHeatmap,
      dayKeys: activityHeatmapDays,
      publicSessionCountInRange: activityHeatmapSessionCount,
    } = await getUserActivityHeatmap(userId);

    return json({
      ...user,
      visitCount,
      sendCount,
      activityHeatmap,
      activityHeatmapDays,
      activityHeatmapSessionCount,
    });
  } catch (error) {
    return catchApiError(_request, error, "유저 정보를 불러올 수 없습니다.");
  }
};
