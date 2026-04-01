"use client";

import { openapi } from "#web/apis/openapi";

import GymReviewDifficultySummary from "./gym-review-difficulty-summary/GymReviewDifficultySummary";
import GymReviewList from "./gym-review-list/GymReivewList";
import GymReviewSummary from "./gym-review-summary/GymReviewSummary";

interface IProps {
  gymId: string;
  avgRating: number;
  reviewCount: number;
}

const GymReviewTab: React.FC<IProps> = ({ gymId, avgRating, reviewCount }) => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms/{gymId}/reviews",
    { params: { path: { gymId } } },
    { select: (d) => d.payload },
  );
  const reviews = data?.items ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-on-surface">리뷰</h2>
      </div>

      <div className="mt-3 mb-4 flex flex-col gap-2 border-b border-white/5 pb-4">
        <GymReviewSummary
          avgRating={avgRating}
          reviewCount={reviewCount}
          gymId={gymId}
        />

        {reviews.length > 0 && <GymReviewDifficultySummary reviews={reviews} />}
      </div>

      <GymReviewList reviews={reviews} />
    </div>
  );
};

export default GymReviewTab;
