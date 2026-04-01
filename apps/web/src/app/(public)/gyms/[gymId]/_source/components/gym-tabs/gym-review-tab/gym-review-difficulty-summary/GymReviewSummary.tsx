import { Star } from "lucide-react";

import { cn } from "#web/libs/utils";

import GymReviewWriteCta from "../gym-review-summary/GymReviewWriteCta";

interface IProps {
  avgRating: number;
  reviewCount: number;
  gymId: string;
}

const GymReviewSummary: React.FC<IProps> = ({
  avgRating,
  reviewCount,
  gymId,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
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
      <GymReviewWriteCta gymId={gymId} />
    </div>
  );
};

export default GymReviewSummary;
