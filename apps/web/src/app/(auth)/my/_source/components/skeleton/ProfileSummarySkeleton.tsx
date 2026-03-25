const ProfileSummarySkeleton = () => {
  return (
    <div className="w-full">
      <div className="flex h-16 items-center justify-between px-6 py-4">
        <div className="h-8 w-16 animate-pulse rounded-lg bg-surface-container-high" />
        <div className="flex gap-4">
          <div className="size-6 animate-pulse rounded bg-surface-container-high" />
          <div className="size-6 animate-pulse rounded bg-surface-container-high" />
        </div>
      </div>
      <div className="h-56 animate-pulse bg-surface-container-low" />
      <div className="flex flex-col items-center px-6 -mt-16">
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
