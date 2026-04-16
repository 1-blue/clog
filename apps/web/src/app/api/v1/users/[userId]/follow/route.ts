import { NotificationType } from "@prisma/client";

import { prisma } from "@clog/db/prisma";

import { ROUTES } from "#web/constants";
import { errorResponse, json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { sendExpoPush } from "#web/libs/expo/sendExpoPush";

/** 팔로우 토글 */
export const POST = async (
  request: Request,
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
      await prisma.$transaction([
        prisma.follow.delete({ where: { id: existing.id } }),
        prisma.notification.deleteMany({
          where: {
            userId: targetId,
            type: NotificationType.FOLLOW,
            link: ROUTES.USERS.PROFILE.path(userId!),
          },
        }),
      ]);
      return json({ following: false });
    } else {
      const follower = await prisma.user.findUnique({
        where: { id: userId! },
        select: { nickname: true },
      });

      await prisma.follow.create({
        data: { followerId: userId!, followingId: targetId },
      });

      if (follower?.nickname) {
        const link = ROUTES.USERS.PROFILE.path(userId!);
        const notif = await prisma.notification.create({
          data: {
            userId: targetId,
            type: NotificationType.FOLLOW,
            title: "새 팔로워",
            message: `${follower.nickname}님이 팔로우했습니다.`,
            link,
          },
        });

        await sendExpoPush({
          recipientUserId: targetId,
          title: notif.title,
          body: notif.message,
          data: {
            type: notif.type,
            link: notif.link ?? undefined,
            notificationId: notif.id,
          },
        });
      }

      return json({ following: true });
    }
  } catch (error) {
    return catchApiError(request, error, "팔로우 처리에 실패했습니다.", {
      userId: userId!,
    });
  }
};
