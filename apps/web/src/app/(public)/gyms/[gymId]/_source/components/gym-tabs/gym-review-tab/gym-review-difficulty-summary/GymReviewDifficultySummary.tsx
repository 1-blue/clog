import { useMemo } from "react";

import { components } from "#web/@types/openapi";
import {
  perceivedDifficultyAxisLabels,
  TGymPerceivedDifficulty,
} from "#web/libs/gym/perceivedDifficultyUi";

const DIFFICULTY_SCORE: Record<TGymPerceivedDifficulty, number> = {
  EASY: 1,
  NORMAL: 2,
  HARD: 3,
};

interface IProps {
  reviews: components["schemas"]["ReviewListItem"][];
}

const GymReviewDifficultySummary: React.FC<IProps> = ({ reviews }) => {
  const difficultySummary = useMemo(() => {
    const scores = reviews
      .map((r) => r.perceivedDifficulty)
      .filter((v): v is TGymPerceivedDifficulty => v != null);

    if (scores.length === 0) return null;

    const sum = scores.reduce((acc, d) => acc + DIFFICULTY_SCORE[d], 0);
    return { avg: sum / scores.length, sampleCount: scores.length };
  }, [reviews]);

  if (!difficultySummary) return null;

  const reviewCount = reviews.length;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-on-surface-variant">
            체감 난이도 평균
            {reviews.length < reviewCount ? (
              <span className="font-normal text-on-surface-variant/80">
                {" "}
                (표시된 {reviews.length}개 리뷰 기준)
              </span>
            ) : null}
          </p>
          <p className="text-[11px] text-on-surface-variant/90">
            쉬움(1) ~ 어려움(3) · 응답 {difficultySummary.sampleCount}명
          </p>
        </div>
        <div
          className="flex items-baseline gap-1 self-start"
          aria-label={`체감 난이도 평균 ${difficultySummary.avg.toFixed(1)} 만점 3`}
        >
          <span className="text-xl font-bold text-on-surface tabular-nums">
            {difficultySummary.avg.toFixed(1)}
          </span>
          <span className="text-sm text-on-surface-variant">/ 3.0</span>
        </div>
      </div>

      <div className="flex flex-col">
        <div
          className="relative h-2 w-full overflow-hidden rounded-full bg-surface-container-high"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={difficultySummary.avg}
          aria-label={`체감 난이도 평균 ${difficultySummary.avg.toFixed(1)}`}
        >
          <div
            className="h-full min-w-0 rounded-full bg-primary transition-[width] duration-300"
            style={{
              width: `${Math.min(100, Math.max(0, ((difficultySummary.avg - 1) / 2) * 100))}%`,
            }}
          />
        </div>
        <div className="mt-1.5 flex w-full justify-between text-[11px] text-on-surface-variant/90">
          {perceivedDifficultyAxisLabels.map(({ key, short }) => (
            <span key={key} className="truncate">
              {short}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GymReviewDifficultySummary;
