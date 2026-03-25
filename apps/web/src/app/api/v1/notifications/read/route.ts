import { prisma } from "@clog/db";

import { errorResponse, jsonWithToast, requireAuth } from "#web/libs/api";

/** 알림 읽음 처리 */
export const PATCH = async () => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    await prisma.notification.updateMany({
      where: { userId: userId!, isRead: false },
      data: { isRead: true },
    });

    return jsonWithToast(null, "모든 알림을 읽음 처리했습니다.");
  } catch {
    return errorResponse("알림 읽음 처리에 실패했습니다.");
  }
};
