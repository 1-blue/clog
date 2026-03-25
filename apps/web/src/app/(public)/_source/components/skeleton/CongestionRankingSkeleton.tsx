const CongestionRankingSkeleton = () => {
  return (
    <section>
      <div className="mb-6 flex justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-surface-container-high" />
          <div className="h-3 w-40 animate-pulse rounded bg-surface-container-high" />
        </div>
        <div className="h-3 w-14 animate-pulse rounded bg-surface-container-high" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-56 w-52 shrink-0 animate-pulse rounded-lg bg-surface-container-low"
          />
        ))}
      </div>
    </section>
  );
};

export default CongestionRankingSkeleton;
