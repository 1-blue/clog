import { closeGymSchema } from "@clog/contracts";
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
    const body = await request.json();
    const { closedReason } = closeGymSchema.parse(body);

    const before = await prisma.gym.findUnique({ where: { id: gymId } });
    if (!before) return errorResponse("암장을 찾을 수 없습니다.", 404);
    if (before.isClosed)
      return errorResponse("이미 폐업 처리된 암장입니다.", 400);

    const updated = await prisma.$transaction(async (tx) => {
      const next = await tx.gym.update({
        where: { id: gymId },
        data: { isClosed: true, closedAt: new Date(), closedReason },
      });
      await logAdminAudit(
        {
          actorId: userId!,
          action: "CLOSE",
          targetType: "Gym",
          targetId: gymId,
          targetLabel: next.name,
          before: {
            isClosed: before.isClosed,
            closedReason: before.closedReason,
          },
          after: { isClosed: next.isClosed, closedReason: next.closedReason },
          note: closedReason,
          request,
        },
        tx,
      );
      return next;
    });

    return jsonWithToast(updated, "폐업 처리되었습니다.");
  } catch (e) {
    return catchApiError(request, e, "폐업 처리에 실패했습니다.");
  }
};
