import { Skeleton } from "#web/components/ui/skeleton";

/** `RecordsCalendar` + `RecordsSelectedDaySection` + `RecordDayCard` 레이아웃에 맞춤 */
const RecordsListSkeleton = () => (
  <div className="flex flex-col gap-8 pb-4">
    {/* RecordsCalendar — Calendar className과 동일 */}
    <div className="mx-auto mt-4 w-full max-w-sm rounded-2xl bg-surface-container p-4">
      <div className="relative flex h-10 items-center justify-center px-12">
        <Skeleton className="absolute left-0 top-0 size-9 shrink-0 rounded-full" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="absolute right-0 top-0 size-9 shrink-0 rounded-full" />
      </div>

      <div className="mt-1 flex justify-evenly">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex size-9 items-center justify-center"
            aria-hidden
          >
            <Skeleton className="h-3 w-4 rounded" />
          </div>
        ))}
      </div>

      {/* 월은 최대 6주 */}
      <div className="mt-1 space-y-0.5">
        {Array.from({ length: 6 }).map((_, w) => (
          <div key={w} className="flex justify-evenly">
            {Array.from({ length: 7 }).map((_, d) => (
              <Skeleton key={d} className="size-9 rounded-full" />
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* RecordsSelectedDaySection */}
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <Skeleton className="h-5 w-52 max-w-full" />
          <Skeleton className="h-6 w-24 shrink-0 rounded-full" />
        </div>
        <Skeleton className="h-11 w-full rounded-2xl" />
      </div>

      {/* RecordDayCard x2 */}
      <div className="flex flex-col gap-4">
        {[0, 1].map((key) => (
          <div
            key={key}
            className="overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/10"
          >
            <Skeleton className="aspect-2/1 w-full rounded-none bg-surface-container-high" />
            <div className="flex flex-col gap-2 px-4 py-3">
              <Skeleton className="h-4 w-[min(100%,16rem)] max-w-xs" />
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-14 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default RecordsListSkeleton;
