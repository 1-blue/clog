import TopBar from "#web/components/layout/TopBar";
import { Skeleton } from "#web/components/ui/skeleton";

/** `RecordDetailMain` 로딩용 — 사진 없을 때 커버 없음과 동일하게 TopBar 직후 본문 */
const RecordDetailSkeleton = () => (
  <div className="flex min-h-dvh flex-col bg-background pb-10">
    <TopBar
      className="border-outline-variant bg-surface-container/80"
      showQuickActions={false}
      title="클라이밍 기록 상세"
    />

    <div className="relative z-10 flex flex-col gap-10 pt-2">
      <div className="flex justify-end">
        <Skeleton className="size-10 shrink-0 rounded-full" />
      </div>

      {/* RecordDetailSessionCard */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface-container-low p-5 shadow-2xl">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="size-12 shrink-0 rounded-xl sm:size-14" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-8 w-[min(100%,15rem)] max-w-[240px]" />
            <Skeleton className="h-3 w-full max-w-sm" />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-3 w-52" />
      </div>

      {/* RecordDetailMembershipBlock */}
      <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/25 bg-surface-container-low px-4 py-3.5">
        <Skeleton className="size-11 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* 난이도 안내 / 범례 자리 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-full max-w-md" />
      </div>

      {/* RecordDetailStatsPanel 상단 + 그리드 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/8 px-4 py-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-9 w-14" />
          </div>
          <Skeleton className="size-14 shrink-0 rounded-full" />
        </div>
        <div>
          <Skeleton className="h-3 w-20" />
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>

      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  </div>
);

export default RecordDetailSkeleton;
