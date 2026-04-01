import { Skeleton } from "#web/components/ui/skeleton";

const ProfileEditMainSkeleton = () => {
  return (
    <div className="pb-28">
      <div className="flex h-14 items-center gap-2 border-b border-outline-variant/30 px-4">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-md" />
      </div>
      <div className="relative">
        <Skeleton className="h-36 w-full rounded-none" />
        <div className="px-6">
          <Skeleton className="-mt-10 size-24 rounded-2xl" />
        </div>
      </div>
      <div className="mx-auto max-w-lg space-y-5 px-4 pt-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default ProfileEditMainSkeleton;
