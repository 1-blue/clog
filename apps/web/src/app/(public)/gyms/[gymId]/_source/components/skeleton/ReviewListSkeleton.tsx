const ReviewListSkeleton = () => {
  return (
    <div className="mt-6 px-4">
      <div className="h-5 w-12 animate-pulse rounded bg-surface-container-low" />
      <div className="mt-3 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-surface-container-low p-3"
          >
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-surface-container-high" />
              <div className="h-4 w-20 rounded bg-surface-container-high" />
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="h-3 w-full rounded bg-surface-container-high" />
              <div className="h-3 w-2/3 rounded bg-surface-container-high" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewListSkeleton;
