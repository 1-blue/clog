const GymListSkeleton = () => {
  return (
    <div className="space-y-3 pt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-2xl bg-surface-container-low"
        />
      ))}
    </div>
  );
};

export default GymListSkeleton;
