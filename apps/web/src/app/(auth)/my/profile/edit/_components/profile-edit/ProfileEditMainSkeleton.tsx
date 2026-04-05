"use client";

import TopBar from "#web/components/layout/TopBar";
import { Card, CardContent, CardHeader } from "#web/components/ui/card";
import { Skeleton } from "#web/components/ui/skeleton";

/** `ProfileEditMain` — TopBar·커버 bleed·아바타·기본/계정 카드·저장 버튼 골격 */
const ProfileEditMainSkeleton = () => {
  return (
    <div>
      <TopBar showQuickActions={false} title="프로필 수정" />

      <div className="relative">
        <div
          className="ml-[calc(50%-50vw)] w-screen max-w-[100vw] shrink-0 overflow-hidden bg-surface-container-low"
          aria-hidden
        >
          <Skeleton className="h-44 w-full rounded-none bg-surface-container-high/40" />
        </div>
        <div className="relative z-10 -mt-12 ml-6 w-fit">
          <Skeleton className="size-24 rounded-full border-4 border-surface shadow-xl ring-1 ring-outline-variant/20" />
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-lg space-y-5 pb-8">
        <Card className="rounded-2xl border-outline-variant/50 bg-surface-container-low py-4 shadow-none ring-1 ring-outline-variant/30">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-5 pt-0">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-14" />
              <div className="flex gap-2">
                <Skeleton className="h-10 min-w-0 flex-1 rounded-xl" />
                <Skeleton className="h-10 w-18 shrink-0 rounded-xl" />
              </div>
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-end justify-between gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="min-h-24 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-full max-w-sm" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-outline-variant/50 bg-surface-container-low py-4 shadow-none ring-1 ring-outline-variant/30">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-outline-variant/50 px-0 pt-0">
            <div className="flex min-h-14 items-center gap-3 px-4 py-3">
              <Skeleton className="size-5 shrink-0 rounded" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-14" />
                <Skeleton className="h-3 w-48 max-w-full" />
              </div>
              <Skeleton className="size-5 shrink-0 rounded" />
            </div>
            <div className="px-4 py-4">
              <div className="mb-3 flex items-center gap-2">
                <Skeleton className="size-5 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="mb-3 h-3 w-full max-w-xs" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default ProfileEditMainSkeleton;
