const MyActivitySkeleton = () => {
  return (
    <section className="mt-12 px-6">
      <div className="mb-6 flex justify-around border-b border-outline-variant/20 pb-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2"
          >
            <div className="size-6 animate-pulse rounded-full bg-surface-container-high" />
            <div className="h-3 w-12 animate-pulse rounded bg-surface-container-high" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-2xl bg-surface-container-low"
          />
        ))}
      </div>
    </section>
  );
};
export default MyActivitySkeleton;
