import { Skeleton } from "#web/components/ui/skeleton";

const RecordDetailSkeleton = () => (
  <div className="flex min-h-dvh flex-col bg-background pb-10">
    <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-outline-variant/30 px-2.5 backdrop-blur-xl">
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="ml-3 h-6 flex-1 rounded-md" />
    </div>
    <div className="aspect-3/4 max-h-[min(100vh,28rem)] w-full animate-pulse bg-surface-container-high md:aspect-video md:max-h-96" />
    <div className="relative z-10 -mt-6 flex flex-col gap-10">
      <div className="flex justify-end">
        <Skeleton className="size-10 rounded-full" />
      </div>
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  </div>
);

export default RecordDetailSkeleton;
