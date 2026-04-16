import { cn } from "#web/libs/utils";

import PostListSkeleton from "./_components/community-post-list/PostListSkeleton";

const chipSkeletonWidths = [
  "w-14",
  "w-16",
  "w-18",
  "w-16",
  "w-20",
  "w-14",
] as const;

/** `(public)/layout`의 `max-w-3xl px-2.5`에 맞춤 — `CommunityMain`과 동일한 상단·필터·리스트 골격 */
const CommunityLoading = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 -mx-2.5 flex h-14 items-center border-b border-outline-variant/30 px-2.5 backdrop-blur-xl">
        <div className="h-6 w-24 animate-pulse rounded-md bg-surface-container-high" />
      </header>

      <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] flex-col gap-4 pt-3 pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-high p-4">
            <div className="size-5 shrink-0 animate-pulse rounded bg-surface-container-low" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-surface-container-low" />
              <div className="h-3 max-w-[92%] animate-pulse rounded bg-surface-container-low" />
            </div>
          </div>

          <nav
            className="scrollbar-hide flex items-center gap-2.5 overflow-x-auto bg-background"
            aria-hidden
          >
            {chipSkeletonWidths.map((w, i) => (
              <div
                key={i}
                className={cn(
                  "h-10 shrink-0 animate-pulse rounded-full bg-surface-container-high",
                  w,
                )}
              />
            ))}
          </nav>
        </div>

        <PostListSkeleton />
      </div>
    </div>
  );
};

export default CommunityLoading;
