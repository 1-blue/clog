import PostListSkeleton from "./_components/community-post-list/PostListSkeleton";

const CommunityLoading = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-2xl px-6 pt-6">
        <div className="mb-6 h-9 w-40 animate-pulse rounded-lg bg-surface-container-low" />
        <div className="mb-6 h-16 animate-pulse rounded-xl bg-surface-container-high" />
        <div className="mb-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-16 shrink-0 animate-pulse rounded-full bg-surface-container-low"
            />
          ))}
        </div>
        <PostListSkeleton />
      </div>
    </div>
  );
};

export default CommunityLoading;
