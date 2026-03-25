"use client";

import { Star } from "lucide-react";

import { openapi } from "#web/apis/openapi";

import { cn } from "#web/libs/utils";

import ReviewListItem from "./ReviewListItem";

interface IProps {
  gymId: string;
  avgRating: number;
  reviewCount: number;
  /** 탭 안에 넣을 때 상단 제목·여백 축소 */
  variant?: "default" | "embedded";
}

const ReviewListSection: React.FC<IProps> = ({
  gymId,
  avgRating,
  reviewCount,
  variant = "default",
}) => {
  const { data: reviewsData } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms/{gymId}/reviews",
    { params: { path: { gymId } } },
    { select: (d) => d.payload },
  );
  const reviews = reviewsData?.items ?? [];

  return (
    <div className={variant === "embedded" ? "" : "mt-6 px-4"}>
      {variant === "default" ? (
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-on-surface">리뷰</h2>
        </div>
      ) : null}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 border-b border-white/5 pb-4",
          variant === "embedded" ? "mb-4" : "mt-3 mb-4",
        )}
      >
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-5 text-tertiary",
                i < Math.round(avgRating) ? "fill-tertiary" : "fill-none",
              )}
              strokeWidth={2}
              aria-hidden
            />
          ))}
        </div>
        <span className="text-sm font-medium text-on-surface">
          {avgRating.toFixed(1)}
        </span>
        <span className="text-sm text-on-surface-variant">
          ({reviewCount}개 리뷰)
        </span>
      </div>
      <div className={variant === "embedded" ? "space-y-3" : "mt-3 space-y-3"}>
        {reviews.map((review) => (
          <ReviewListItem key={review.id} review={review} />
        ))}
        {reviews.length === 0 && (
          <p className="py-4 text-center text-sm text-on-surface-variant">
            아직 리뷰가 없습니다
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewListSection;
