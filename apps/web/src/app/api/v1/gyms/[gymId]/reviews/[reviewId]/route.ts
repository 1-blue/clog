import { prisma } from "@clog/db";
import { updateReviewSchema } from "@clog/utils";

import {
  errorResponse,
  json,
  jsonWithToast,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { normalizeReviewJsonBody } from "#web/libs/reviewBody";

import { gymReviewListInclude } from "../_reviewInclude";

const syncGymReviewStats = async (gymId: string) => {
  const agg = await prisma.gymReview.aggregate({
    where: { gymId },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.gym.update({
    where: { id: gymId },
    data: {
      avgRating: agg._avg.rating ?? 0,
      reviewCount: agg._count,
    },
  });
};

/** 리뷰 단건 (공개) */
export const GET = async (
  _request: Request,
  {
    params,
  }: { params: Promise<{ gymId: string; reviewId: string }> },
) => {
  const { gymId, reviewId } = await params;

  try {
    const review = await prisma.gymReview.findFirst({
      where: { id: reviewId, gymId },
      include: gymReviewListInclude,
    });

    if (!review) {
      return errorResponse("리뷰를 찾을 수 없습니다.", 404);
    }

    return json(review);
  } catch (error) {
    return catchApiError(_request, error, "리뷰를 불러올 수 없습니다.");
  }
};

/** 리뷰 수정 */
export const PATCH = async (
  request: Request,
  {
    params,
  }: { params: Promise<{ gymId: string; reviewId: string }> },
) => {
  const { gymId, reviewId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const raw = await request.json();
    const body = normalizeReviewJsonBody(raw);
    const parsed = updateReviewSchema.safeParse(body);
    if (!parsed.success) {
      console.error("리뷰 수정 검증", parsed.error.flatten());
      return errorResponse(
        parsed.error.issues.map((i) => i.message).join(" ") ||
          "입력값이 올바르지 않습니다.",
        400,
      );
    }
    const data = parsed.data;

    const existing = await prisma.gymReview.findFirst({
      where: { id: reviewId, gymId },
    });
    if (!existing) {
      return errorResponse("리뷰를 찾을 수 없습니다.", 404);
    }
    if (existing.userId !== userId) {
      return errorResponse("권한이 없습니다.", 403);
    }

    const review = await prisma.gymReview.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        content: data.content,
        perceivedDifficulty: data.perceivedDifficulty ?? null,
        features: data.features ?? [],
        imageUrls: data.imageUrls ?? [],
      },
    });

    await syncGymReviewStats(gymId);

    return jsonWithToast(review, "리뷰가 수정되었습니다.");
  } catch (error) {
    return catchApiError(request, error, "리뷰 수정에 실패했습니다.", {
      userId: userId!,
    });
  }
};
