import { Skeleton } from "#web/components/ui/skeleton";

const RecordsListSkeleton = () => (
  <div>
    {/* 캘린더 스켈레톤 — 실제 Calendar className과 동일하게 맞춤 */}
    <div className="mx-auto mt-8 w-full max-w-sm rounded-2xl bg-surface-container p-4">
      {/* 헤더: [<] [xxxx년 xx월] [>] */}
      <div className="flex h-10 items-center justify-between px-1">
        <Skeleton className="size-9 rounded-full" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="size-9 rounded-full" />
      </div>

      {/* 요일 헤더 */}
      <div className="mt-1 flex justify-evenly">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="size-9 rounded" />
        ))}
      </div>

      {/* 날짜 셀 (5주) */}
      <div className="mt-1 space-y-0.5">
        {Array.from({ length: 5 }).map((_, w) => (
          <div key={w} className="flex justify-evenly">
            {Array.from({ length: 7 }).map((_, d) => (
              <Skeleton key={d} className="size-9 rounded-full" />
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* 기록 카드 스켈레톤 */}
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="overflow-hidden rounded-2xl">
        <Skeleton className="aspect-2/1 w-full rounded-none" />
        <div className="space-y-2 bg-surface-container-low p-4">
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RecordsListSkeleton;
