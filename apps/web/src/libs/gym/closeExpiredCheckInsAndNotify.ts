import { NotificationType, type Notification } from "@prisma/client";
import { prisma } from "@clog/db";

import { ROUTES } from "#web/constants";
import { sendExpoPush } from "#web/libs/expo/sendExpoPush";

/** 만료된 체크인을 종료하고 AUTO_CHECKOUT 알림을 생성합니다. */
export const closeExpiredCheckInsAndNotify = async (userId: string) => {
  const now = new Date();
  const expired = await prisma.gymCheckIn.findMany({
    where: {
      userId,
      endedAt: null,
      endsAt: { lte: now },
    },
    include: { gym: { select: { id: true, name: true } } },
  });

  if (expired.length === 0) return;

  const createdNotifications: Notification[] = [];

  await prisma.$transaction(async (tx) => {
    for (const checkIn of expired) {
      await tx.gymCheckIn.update({
        where: { id: checkIn.id },
        data: { endedAt: now },
      });
      const notif = await tx.notification.create({
        data: {
          userId,
          type: NotificationType.AUTO_CHECKOUT,
          title: "자동 체크아웃",
          message: `${checkIn.gym.name}에서 체크인 시간이 종료되어 자동 체크아웃되었습니다.`,
          link: ROUTES.GYMS.DETAIL.path(checkIn.gymId),
        },
      });
      createdNotifications.push(notif);
    }
  });

  for (const notif of createdNotifications) {
    await sendExpoPush({
      recipientUserId: userId,
      title: notif.title,
      body: notif.message,
      data: {
        type: notif.type,
        link: notif.link ?? undefined,
        notificationId: notif.id,
      },
    });
  }
};
