import { prisma } from "@clog/db/prisma";

import { logAdminAudit } from "#web/libs/admin/audit";
import { errorResponse, jsonWithToast, requireAdmin } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) => {
  const { userId, error } = await requireAdmin();
  if (error) return error;

  const { reviewId } = await params;
  try {
    const before = await prisma.gymReview.findUnique({
      where: { id: reviewId },
    });
    if (!before) return errorResponse("리뷰를 찾을 수 없습니다.", 404);

    await prisma.$transaction(async (tx) => {
      await tx.gymReview.delete({ where: { id: reviewId } });
      // 평균 평점 재계산
      const agg = await tx.gymReview.aggregate({
        where: { gymId: before.gymId },
        _avg: { rating: true },
        _count: true,
      });
      await tx.gym.update({
        where: { id: before.gymId },
        data: {
          avgRating: agg._avg.rating ?? 0,
          reviewCount: agg._count,
        },
      });
      await logAdminAudit(
        {
          actorId: userId!,
          action: "DELETE",
          targetType: "GymReview",
          targetId: reviewId,
          before,
          request,
        },
        tx,
      );
    });

    return jsonWithToast(null, "리뷰가 삭제되었습니다.");
  } catch (e) {
    return catchApiError(request, e, "리뷰 삭제에 실패했습니다.");
  }
};
