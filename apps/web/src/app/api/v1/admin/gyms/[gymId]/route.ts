import { updateGymSchema } from "@clog/contracts";
import { prisma } from "@clog/db/prisma";

import { logAdminAudit } from "#web/libs/admin/audit";
import {
  errorResponse,
  json,
  jsonWithToast,
  requireAdmin,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { error } = await requireAdmin();
  if (error) return error;

  const { gymId } = await params;
  try {
    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      include: {
        images: { orderBy: { order: "asc" } },
        openHours: true,
        difficultyColors: true,
        membershipPlans: true,
      },
    });
    if (!gym) return errorResponse("암장을 찾을 수 없습니다.", 404);
    return json(gym);
  } catch (e) {
    return catchApiError(request, e, "암장을 불러올 수 없습니다.");
  }
};

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { userId, error } = await requireAdmin();
  if (error) return error;

  const { gymId } = await params;
  try {
    const body = await request.json();
    const data = updateGymSchema.parse(body);

    const before = await prisma.gym.findUnique({ where: { id: gymId } });
    if (!before) return errorResponse("암장을 찾을 수 없습니다.", 404);

    const updated = await prisma.$transaction(async (tx) => {
      const next = await tx.gym.update({ where: { id: gymId }, data });
      await logAdminAudit(
        {
          actorId: userId!,
          action: "UPDATE",
          targetType: "Gym",
          targetId: gymId,
          targetLabel: next.name,
          before,
          after: next,
          request,
        },
        tx,
      );
      return next;
    });
    return jsonWithToast(updated, "암장이 수정되었습니다.");
  } catch (e) {
    return catchApiError(request, e, "암장 수정에 실패했습니다.");
  }
};
