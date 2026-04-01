const ProfileSummarySkeleton = () => {
  return (
    <div className="w-full">
      <div className="flex h-14 items-center justify-between border-b border-outline-variant/30 px-2.5">
        <div className="h-8 w-16 animate-pulse rounded-lg bg-surface-container-high" />
        <div className="flex gap-4">
          <div className="size-6 animate-pulse rounded bg-surface-container-high" />
          <div className="size-6 animate-pulse rounded bg-surface-container-high" />
        </div>
      </div>
      <div className="-mx-2.5 h-56 w-[calc(100%+1.25rem)] animate-pulse bg-surface-container-low" />
      <div className="-mt-16 flex flex-col items-center">
        <div className="size-32 animate-pulse rounded-full border-4 border-background bg-surface-container-high" />
        <div className="mt-4 h-8 w-32 animate-pulse rounded bg-surface-container-high" />
        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-surface-container-high" />
        <div className="mt-8 grid w-full max-w-md grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-surface-container-low"
            />
          ))}
        </div>
        <div className="mt-8 h-12 w-full max-w-sm animate-pulse rounded-xl bg-surface-container-high" />
      </div>
    </div>
  );
};

export default ProfileSummarySkeleton;
