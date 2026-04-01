const BookmarkedPostsPanelSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="h-32 animate-pulse rounded-2xl bg-surface-container-low"
      />
    ))}
  </div>
);

export default BookmarkedPostsPanelSkeleton;
