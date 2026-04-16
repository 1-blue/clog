/**
 * `GymReviewTab` Suspense fallback — 실제 탭 구조(제목·요약·체감 난이도·리스트 카드)와 맞춤.
 */
const GymReviewSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-14 rounded bg-surface-container-low" />
      </div>

      <div className="mt-3 mb-4 flex flex-col gap-2 border-b border-white/5 pb-4">
        {/* GymReviewSummary */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="size-5 rounded-sm bg-surface-container-low"
                />
              ))}
            </div>
            <div className="h-4 w-8 rounded bg-surface-container-low" />
            <div className="h-4 w-28 rounded bg-surface-container-low" />
          </div>
          <div className="h-9 w-28 shrink-0 rounded-xl border border-white/10 bg-surface-container-high/60" />
        </div>

        {/* GymReviewDifficultySummary (데이터 있을 때만 실제 노출 — 로딩 중엔 자리만) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="h-3 w-32 rounded bg-surface-container-low" />
              <div className="h-2.5 w-44 rounded bg-surface-container-low" />
            </div>
            <div className="flex items-baseline gap-1">
              <div className="h-7 w-10 rounded bg-surface-container-low" />
              <div className="h-4 w-12 rounded bg-surface-container-low" />
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-surface-container-high" />
          <div className="mt-1.5 flex w-full justify-between gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-2 max-w-14 min-w-0 flex-1 rounded bg-surface-container-low"
              />
            ))}
          </div>
        </div>
      </div>

      {/* GymReviewList — GymReview 카드 */}
      <div className="mt-4 flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl bg-surface-container-low p-3"
          >
            <div className="flex min-h-9 items-stretch gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5">
                <div className="size-7 shrink-0 rounded-full bg-surface-container-high" />
                <div className="h-4 max-w-28 flex-1 rounded bg-surface-container-high" />
              </div>
              <div className="ml-auto flex shrink-0 flex-col items-end gap-1 self-center">
                <div className="h-2.5 w-24 rounded bg-surface-container-high" />
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div
                      key={j}
                      className="size-3.5 shrink-0 rounded-sm bg-surface-container-high"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="h-16 w-full rounded-lg bg-surface-container-high/70" />

            <div className="space-y-1.5">
              <div className="h-3 w-full rounded bg-surface-container-high" />
              <div className="h-3 w-full rounded bg-surface-container-high" />
              <div className="h-3 max-w-[75%] rounded bg-surface-container-high" />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <div className="h-6 min-w-20 rounded-full bg-surface-container-high" />
              <div className="h-6 w-16 rounded-full bg-surface-container-high" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymReviewSkeleton;
