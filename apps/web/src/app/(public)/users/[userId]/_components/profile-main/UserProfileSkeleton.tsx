import { Skeleton } from "#web/components/ui/skeleton";

const UserProfileSkeleton = () => {
  return (
    <div className="pb-24">
      <div className="fixed top-0 right-0 left-0 z-40 mx-auto flex h-16 max-w-lg items-center justify-between border-b border-outline-variant/60 bg-background/95 px-2.5">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="size-10 rounded-full" />
      </div>
      <div className="h-16" />
      <Skeleton className="-mx-2.5 h-48 w-[calc(100%+1.25rem)] rounded-none" />
      <div className="-mt-20 flex flex-col items-center">
        <Skeleton className="size-32 rounded-xl border-4 border-surface" />
        <Skeleton className="mt-4 h-9 w-40 rounded-md" />
        <Skeleton className="mt-3 h-4 w-56 rounded-md" />
        <Skeleton className="mt-6 h-12 w-full max-w-sm rounded-xl" />
      </div>
      <div className="mt-10">
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <div className="mt-8">
        <Skeleton className="h-36 w-full rounded-xl" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-0.5 px-0">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-none" />
        ))}
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
