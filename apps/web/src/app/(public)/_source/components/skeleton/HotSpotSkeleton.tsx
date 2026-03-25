const HotSpotSkeleton = () => {
  return (
    <section>
      <div className="mb-6 flex justify-between">
        <div className="h-5 w-32 animate-pulse rounded bg-surface-container-high" />
        <div className="h-4 w-16 animate-pulse rounded bg-surface-container-high" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 h-44 animate-pulse rounded-lg bg-surface-container-low" />
        <div className="h-24 animate-pulse rounded-lg bg-surface-container-low" />
        <div className="h-24 animate-pulse rounded-lg bg-surface-container-low" />
      </div>
    </section>
  );
};

export default HotSpotSkeleton;
