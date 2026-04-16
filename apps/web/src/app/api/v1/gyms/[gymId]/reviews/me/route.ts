import { prisma } from "@clog/db/prisma";

import { errorResponse, json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

import { gymReviewListInclude } from "../_reviewInclude";

/** 내 리뷰 (해당 암장) — 없으면 payload null */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { gymId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const review = await prisma.gymReview.findFirst({
      where: { gymId, userId: userId! },
      include: gymReviewListInclude,
    });

    return json(review ?? null);
  } catch (error) {
    return catchApiError(request, error, "리뷰를 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};
