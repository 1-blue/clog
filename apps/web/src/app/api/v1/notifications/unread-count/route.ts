import { prisma } from "@clog/db/prisma";

import { json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 미읽음 알림 개수 (TopBar 배지용) */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const count = await prisma.notification.count({
      where: { userId: userId!, isRead: false },
    });

    return json({ count });
  } catch (err) {
    return catchApiError(request, err, "알림 개수를 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};
