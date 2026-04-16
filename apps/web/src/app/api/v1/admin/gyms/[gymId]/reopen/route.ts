import { prisma } from "@clog/db/prisma";

import { logAdminAudit } from "#web/libs/admin/audit";
import { errorResponse, jsonWithToast, requireAdmin } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { userId, error } = await requireAdmin();
  if (error) return error;

  const { gymId } = await params;
  try {
    const before = await prisma.gym.findUnique({ where: { id: gymId } });
    if (!before) return errorResponse("암장을 찾을 수 없습니다.", 404);
    if (!before.isClosed)
      return errorResponse("이미 운영 중인 암장입니다.", 400);

    const updated = await prisma.$transaction(async (tx) => {
      const next = await tx.gym.update({
        where: { id: gymId },
        data: { isClosed: false, closedAt: null, closedReason: null },
      });
      await logAdminAudit(
        {
          actorId: userId!,
          action: "REOPEN",
          targetType: "Gym",
          targetId: gymId,
          targetLabel: next.name,
          before: {
            isClosed: before.isClosed,
            closedReason: before.closedReason,
          },
          after: { isClosed: next.isClosed, closedReason: null },
          request,
        },
        tx,
      );
      return next;
    });

    return jsonWithToast(updated, "운영 재개되었습니다.");
  } catch (e) {
    return catchApiError(request, e, "운영 재개에 실패했습니다.");
  }
};
