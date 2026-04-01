import { Skeleton } from "#web/components/ui/skeleton";

const RecordFormPageSkeleton = () => {
  return (
    <div className="min-h-svh bg-background pb-10">
      <div className="flex h-14 items-center gap-2 border-b border-outline-variant px-2.5">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-6 flex-1 rounded-md" />
        <Skeleton className="h-9 w-16 rounded-full" />
      </div>
      <div className="mx-auto max-w-lg space-y-5 pt-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
};

export default RecordFormPageSkeleton;
