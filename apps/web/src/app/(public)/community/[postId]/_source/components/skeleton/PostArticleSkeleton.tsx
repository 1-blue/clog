const PostArticleSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="relative -mx-6 aspect-4/5 w-screen max-w-none bg-surface-container-low sm:mx-0 sm:w-full sm:rounded-2xl" />

      <div className="mt-8 space-y-3">
        <div className="h-6 w-20 rounded-full bg-surface-container-low" />
        <div className="h-9 w-full rounded bg-surface-container-low" />
        <div className="h-9 w-4/5 rounded bg-surface-container-low" />
      </div>

      <div className="mt-8 flex items-center justify-between border-b border-outline-variant/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-surface-container-low" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-surface-container-low" />
            <div className="h-3 w-20 rounded bg-surface-container-low" />
          </div>
        </div>
        <div className="h-8 w-20 rounded-full bg-surface-container-low" />
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-surface-container-low" />
        <div className="h-4 w-full rounded bg-surface-container-low" />
        <div className="h-4 w-5/6 rounded bg-surface-container-low" />
      </div>
    </div>
  );
};

export default PostArticleSkeleton;
