import { Skeleton } from "#web/components/ui/skeleton";

const GymReviewSkeleton = () => {
  return (
    <div className="min-h-svh bg-background pb-10">
      <div className="flex h-14 items-center gap-2 border-b border-outline-variant px-2.5">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-6 flex-1 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
      <div className="mx-auto max-w-lg space-y-8 pt-5">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="flex justify-center gap-2 py-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="size-12 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="min-h-36 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default GymReviewSkeleton;
