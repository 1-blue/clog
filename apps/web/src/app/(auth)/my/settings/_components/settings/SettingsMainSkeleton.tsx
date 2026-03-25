import { Skeleton } from "#web/components/ui/skeleton";

const SettingsMainSkeleton = () => {
  return (
    <div className="pb-12">
      <div className="flex h-14 items-center gap-2 border-b border-outline-variant px-4">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <div className="mx-auto max-w-lg space-y-4 px-4 pt-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
};

export default SettingsMainSkeleton;
