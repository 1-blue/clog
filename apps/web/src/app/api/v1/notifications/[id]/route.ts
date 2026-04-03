import { prisma } from "@clog/db";
import { patchNotificationSchema } from "@clog/utils";

import {
  errorResponse,
  jsonWithToast,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 알림 단건 읽음 */
export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    patchNotificationSchema.parse(body);

    const existing = await prisma.notification.findFirst({
      where: { id, userId: userId! },
    });
    if (!existing) return errorResponse("알림을 찾을 수 없습니다.", 404);

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return jsonWithToast(updated, "읽음 처리했습니다.");
  } catch (e) {
    return catchApiError(request, e, "알림을 읽을 수 없습니다.", {
      userId: userId!,
    });
  }
};

/** 알림 단건 삭제 (영구) */
export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const result = await prisma.notification.deleteMany({
      where: { id, userId: userId! },
    });
    if (result.count === 0) {
      return errorResponse("알림을 찾을 수 없습니다.", 404);
    }

    return jsonWithToast(null, "알림을 삭제했습니다.");
  } catch (e) {
    return catchApiError(_request, e, "알림을 삭제할 수 없습니다.", {
      userId: userId!,
    });
  }
};
