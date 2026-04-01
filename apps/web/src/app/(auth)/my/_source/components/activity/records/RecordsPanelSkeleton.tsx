const RecordsPanelSkeleton = () => (
  <div className="grid grid-cols-2 gap-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="aspect-[3/4] animate-pulse rounded-2xl bg-surface-container-low"
      />
    ))}
  </div>
);

export default RecordsPanelSkeleton;
