const PostListSkeleton = () => {
  return (
    <div className="space-y-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-2xl border border-outline-variant/5 bg-surface-container-low"
        />
      ))}
    </div>
  );
};

export default PostListSkeleton;
