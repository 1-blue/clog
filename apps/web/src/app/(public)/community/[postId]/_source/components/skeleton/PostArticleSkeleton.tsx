/**
 * `PostArticlePanel` — 미디어 → 배지·제목 → 작성자 행 → 본문·태그 (`gap-6`)
 */
const PostArticleSkeleton: React.FC = () => {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div
        className={[
          "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
          "sm:relative sm:left-0 sm:w-full sm:max-w-none sm:translate-x-0",
        ].join(" ")}
      >
        <div className="relative aspect-16/10 max-h-64 w-full overflow-hidden bg-surface-container-high ring-1 ring-foreground/10 ring-inset sm:max-h-72" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-6 w-16 rounded-full bg-surface-container-low" />
        <div className="h-9 w-full rounded-lg bg-surface-container-low" />
        <div className="h-9 max-w-[90%] rounded-lg bg-surface-container-low" />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-11 shrink-0 rounded-full bg-surface-container-low" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-surface-container-low" />
            <div className="h-3 w-20 rounded bg-surface-container-low" />
          </div>
        </div>
        <div className="h-8 w-18 shrink-0 rounded-full bg-surface-container-low" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="min-h-20 rounded-sm bg-primary/15 px-3 py-3">
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-surface-container-low/80" />
            <div className="h-4 w-full rounded bg-surface-container-low/80" />
            <div className="h-4 max-w-[85%] rounded bg-surface-container-low/80" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-16 rounded-full bg-surface-container-highest/60" />
          <div className="h-7 w-14 rounded-full bg-surface-container-highest/60" />
        </div>
      </div>
    </div>
  );
};

export default PostArticleSkeleton;
