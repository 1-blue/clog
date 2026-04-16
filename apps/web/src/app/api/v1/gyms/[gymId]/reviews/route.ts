import { createReviewSchema, reviewQuerySchema } from "@clog/contracts";
import { prisma } from "@clog/db/prisma";

import {
  errorResponse,
  getSearchParams,
  jsonWithToast,
  paginatedJson,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { normalizeReviewJsonBody } from "#web/libs/reviewBody";

import { gymReviewListInclude } from "./_reviewInclude";

/** 리뷰 목록 (무한스크롤) */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { gymId } = await params;

  try {
    const searchParams = getSearchParams(request);
    const query = reviewQuerySchema.parse(searchParams);

    const reviews = await prisma.gymReview.findMany({
      where: { gymId },
      orderBy: { createdAt: "desc" },
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
      include: gymReviewListInclude,
    });

    const hasMore = reviews.length > query.limit;
    const items = hasMore ? reviews.slice(0, query.limit) : reviews;
    const nextCursor = hasMore ? items[items.length - 1]!.id : null;

    return paginatedJson(items, nextCursor);
  } catch (error) {
    return catchApiError(request, error, "리뷰를 불러올 수 없습니다.");
  }
};

/** 리뷰 작성 */
export const POST = async (
  request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { gymId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const raw = await request.json();
    const body = normalizeReviewJsonBody(raw);
    const data = createReviewSchema.parse(body);

    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: { isClosed: true },
    });
    if (!gym) return errorResponse("암장을 찾을 수 없습니다.", 404);
    if (gym.isClosed) return errorResponse("폐업한 암장입니다.", 400);

    // 중복 리뷰 체크
    const existing = await prisma.gymReview.findUnique({
      where: { userId_gymId: { userId: userId!, gymId } },
    });
    if (existing) return errorResponse("이미 리뷰를 작성하셨습니다.");

    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.gymReview.create({
        data: {
          userId: userId!,
          gymId,
          rating: data.rating,
          content: data.content,
          perceivedDifficulty: data.perceivedDifficulty ?? null,
          features: data.features ?? [],
          imageUrls: data.imageUrls ?? [],
        },
      });

      // 평균 평점 + 리뷰 수 업데이트 (트랜잭션 내)
      const agg = await tx.gymReview.aggregate({
        where: { gymId },
        _avg: { rating: true },
        _count: true,
      });
      await tx.gym.update({
        where: { id: gymId },
        data: {
          avgRating: agg._avg.rating ?? 0,
          reviewCount: agg._count,
        },
      });

      return created;
    });

    return jsonWithToast(review, "리뷰가 등록되었습니다.", 201);
  } catch (error) {
    return catchApiError(request, error, "리뷰 작성에 실패했습니다.", {
      userId: userId!,
    });
  }
};
