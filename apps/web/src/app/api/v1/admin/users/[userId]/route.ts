import { adminUpdateUserSchema } from "@clog/contracts";
import { prisma } from "@clog/db/prisma";

import { logAdminAudit } from "#web/libs/admin/audit";
import { errorResponse, jsonWithToast, requireAdmin } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { userId: actorId, error } = await requireAdmin();
  if (error) return error;

  const { userId } = await params;
  try {
    const body = await request.json();
    const data = adminUpdateUserSchema.parse(body);

    const before = await prisma.user.findUnique({ where: { id: userId } });
    if (!before) return errorResponse("유저를 찾을 수 없습니다.", 404);

    const updated = await prisma.$transaction(async (tx) => {
      const next = await tx.user.update({ where: { id: userId }, data });
      const action =
        data.role !== undefined && data.role !== before.role
          ? "ROLE_CHANGE"
          : "UPDATE";
      await logAdminAudit(
        {
          actorId: actorId!,
          action,
          targetType: "User",
          targetId: userId,
          targetLabel: next.nickname,
          before: {
            nickname: before.nickname,
            role: before.role,
            homeGymId: before.homeGymId,
          },
          after: {
            nickname: next.nickname,
            role: next.role,
            homeGymId: next.homeGymId,
          },
          request,
        },
        tx,
      );
      return next;
    });

    return jsonWithToast(updated, "유저 정보가 수정되었습니다.");
  } catch (e) {
    return catchApiError(request, e, "유저 수정에 실패했습니다.");
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) => {
  const { userId: actorId, error } = await requireAdmin();
  if (error) return error;

  const { userId } = await params;
  try {
    const before = await prisma.user.findUnique({ where: { id: userId } });
    if (!before) return errorResponse("유저를 찾을 수 없습니다.", 404);

    await prisma.$transaction(async (tx) => {
      await tx.user.delete({ where: { id: userId } });
      await logAdminAudit(
        {
          actorId: actorId!,
          action: "DELETE",
          targetType: "User",
          targetId: userId,
          targetLabel: before.nickname,
          before,
          request,
        },
        tx,
      );
    });

    return jsonWithToast(null, "유저가 삭제되었습니다.");
  } catch (e) {
    return catchApiError(request, e, "유저 삭제에 실패했습니다.");
  }
};
