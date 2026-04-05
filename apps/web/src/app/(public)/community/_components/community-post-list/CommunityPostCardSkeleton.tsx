import { Skeleton } from "#web/components/ui/skeleton";

interface IProps {
  withImage?: boolean;
  withTags?: boolean;
}

/** `CommunityPostCard` 레이아웃 정합 */
const CommunityPostCardSkeleton: React.FC<IProps> = ({
  withImage = true,
  withTags = false,
}) => (
  <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-2xl border border-outline-variant/5 bg-surface-container-low">
    <div className="flex flex-col">
      {withImage ? (
        <div className="aspect-video w-full shrink-0 animate-pulse bg-surface-container-highest" />
      ) : null}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>

        {withTags ? (
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-14 animate-pulse rounded-full border border-outline-variant/10 bg-background" />
            <div className="h-6 w-12 animate-pulse rounded-full border border-outline-variant/10 bg-background" />
          </div>
        ) : null}

        <Skeleton className="h-5 max-w-[min(100%,18rem)]" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 max-w-[88%]" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="size-6 shrink-0 rounded-full bg-surface-container-highest ring-1 ring-outline-variant/20" />
          <Skeleton className="h-3 w-28" />
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-outline-variant/10 pt-2">
          <Skeleton className="h-4 w-11" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-9" />
        </div>
      </div>
    </div>
  </div>
);

export default CommunityPostCardSkeleton;
