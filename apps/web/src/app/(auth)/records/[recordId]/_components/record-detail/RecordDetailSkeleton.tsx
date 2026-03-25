import { Skeleton } from "#web/components/ui/skeleton";

const RecordDetailSkeleton = () => (
  <div className="pb-10">
    <div className="aspect-3/4 max-h-screen w-full animate-pulse bg-surface-container-high md:aspect-video" />
    <div className="relative z-10 -mt-10 space-y-4 px-4">
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
