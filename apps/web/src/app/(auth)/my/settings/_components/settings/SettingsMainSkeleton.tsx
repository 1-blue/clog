import TopBar from "#web/components/layout/TopBar";
import { Skeleton } from "#web/components/ui/skeleton";

const SettingsMainSkeleton = () => {
  return (
    <div className="pb-8">
      <TopBar title="설정" />
      <div className="mx-auto flex max-w-lg flex-col gap-8 pt-4">
        {/* 프로필 요약 카드 (내 프로필 링크 + 카드 내 로그아웃) */}
        <div className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-low ring-1 ring-outline-variant/30">
          <div className="flex items-center gap-4 p-4">
            <Skeleton className="size-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-32 max-w-full rounded-md" />
              <Skeleton className="h-4 w-40 max-w-full rounded-md" />
            </div>
            <Skeleton className="size-5 shrink-0 rounded-sm opacity-70" />
          </div>
          <div className="border-t border-outline-variant/30">
            <div className="flex min-h-12 items-center gap-3 px-4 py-3">
              <Skeleton className="size-5 shrink-0 rounded-sm" />
              <Skeleton className="h-4 w-14 rounded-md" />
            </div>
          </div>
        </div>

        {/* 계정 설정 */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-20 rounded-md" />
          <div className="divide-y divide-outline-variant/50 overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/40">
            <div className="flex min-h-14 items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-5 shrink-0 rounded-sm" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-full max-w-[220px] rounded-md" />
              </div>
              <Skeleton className="size-5 shrink-0 rounded-sm opacity-70" />
            </div>
          </div>
        </div>

        {/* 앱 설정 */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-16 rounded-md" />
          <div className="divide-y divide-outline-variant/50 overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/40">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-5 shrink-0 rounded-sm" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-3 w-full max-w-[260px] rounded-md" />
              </div>
              <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-5 shrink-0 rounded-sm" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
              <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
            </div>
            <div className="flex gap-3 px-4 py-3.5">
              <Skeleton className="mt-0.5 size-5 shrink-0 rounded-sm" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-3 w-full max-w-[280px] rounded-md" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* 정보 */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-10 rounded-md" />
          <div className="divide-y divide-outline-variant/50 overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/40">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-5 shrink-0 rounded-sm" />
              <Skeleton className="h-4 flex-1 rounded-md" />
              <Skeleton className="h-3 w-9 rounded-md" />
            </div>
            <div className="flex min-h-14 items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-5 shrink-0 rounded-sm" />
              <Skeleton className="h-4 flex-1 rounded-md" />
              <Skeleton className="size-4 shrink-0 rounded-sm opacity-70" />
            </div>
            <div className="flex min-h-14 items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-5 shrink-0 rounded-sm" />
              <Skeleton className="h-4 flex-1 rounded-md" />
              <Skeleton className="size-4 shrink-0 rounded-sm opacity-70" />
            </div>
          </div>
        </div>

        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default SettingsMainSkeleton;
