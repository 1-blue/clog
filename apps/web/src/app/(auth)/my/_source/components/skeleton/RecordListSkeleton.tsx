const RecordListSkeleton = () => {
  return (
    <div className="mt-6">
      <div className="h-6 w-20 animate-pulse rounded bg-surface-container-high" />
      <div className="mt-3 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-surface-container-low"
          />
        ))}
      </div>
    </div>
  );
};
export default RecordListSkeleton;
