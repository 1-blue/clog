import { Skeleton } from "#web/components/ui/skeleton";

/** `ProfileSummarySection` + `TopBar`(좌 제목·우 퀵액션 4) 정합 */
const ProfileSummarySkeleton = () => {
  return (
    <div className="w-full">
      <header className="sticky top-0 z-40 -mx-2.5 flex h-14 items-center justify-between border-b border-outline-variant/30 px-2.5 backdrop-blur-xl">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <div className="flex items-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="size-6 rounded-md" />
          ))}
        </div>
      </header>

      <section className="relative z-0 -mx-2.5 h-56 w-[calc(100%+1.25rem)] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary-container/50 via-primary/35 to-secondary-container/45 opacity-90" />
      </section>

      <section className="relative z-20 -mt-16 flex flex-col items-center">
        <div className="relative">
          <Skeleton className="size-32 rounded-full border-4 border-background shadow-xl ring-1 ring-outline-variant/20" />
          <Skeleton className="absolute right-1 bottom-1 size-8 rounded-full border-4 border-background" />
        </div>

        <div className="mt-4 flex w-full max-w-xs flex-col items-center">
          <Skeleton className="h-9 w-36 max-w-full" />
          <Skeleton className="mt-2 h-4 w-28" />
          <Skeleton className="mt-3 h-3 w-48 max-w-full" />
        </div>

        <div className="mt-8 grid w-full max-w-md grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl border border-outline-variant/10 bg-surface-container-low py-3"
            >
              <Skeleton className="h-7 w-10" />
              <Skeleton className="mt-1.5 h-3 w-12" />
            </div>
          ))}
        </div>

        <Skeleton className="mt-8 h-12 w-full max-w-sm rounded-xl" />
      </section>
    </div>
  );
};

export default ProfileSummarySkeleton;
