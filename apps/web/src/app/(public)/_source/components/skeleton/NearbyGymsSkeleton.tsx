const NearbyGymsSkeleton = () => {
  return (
    <section>
      <div className="mb-6 flex justify-between">
        <div className="h-5 w-40 animate-pulse rounded bg-surface-container-high" />
        <div className="h-4 w-24 animate-pulse rounded bg-surface-container-high" />
      </div>
      <div className="flex gap-6 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-64 shrink-0">
            <div className="mb-3 aspect-[4/3] animate-pulse rounded-lg bg-surface-container-low" />
            <div className="h-4 w-48 animate-pulse rounded bg-surface-container-high" />
            <div className="mt-2 h-3 w-32 animate-pulse rounded bg-surface-container-high" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default NearbyGymsSkeleton;
