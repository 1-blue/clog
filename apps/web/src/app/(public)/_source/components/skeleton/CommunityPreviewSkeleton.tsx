const CommunityPreviewSkeleton = () => {
  return (
    <section>
      <div className="mb-6 h-5 w-36 animate-pulse rounded bg-surface-container-high" />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="size-20 shrink-0 animate-pulse rounded-lg bg-surface-container-low" />
            <div className="flex-1 space-y-2 border-b border-white/5 pb-4">
              <div className="h-3 w-24 animate-pulse rounded bg-surface-container-high" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-container-high" />
              <div className="h-3 w-20 animate-pulse rounded bg-surface-container-high" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-surface-container-low" />
    </section>
  );
};

export default CommunityPreviewSkeleton;
