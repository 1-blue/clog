"use client";

import TopBar from "#web/components/layout/TopBar";
import { Skeleton } from "#web/components/ui/skeleton";

/** `MembershipsListMain` — TopBar·회원권 등록 버튼·목록 카드 행 */
const MembershipsListSkeleton = () => (
  <div className="flex min-h-dvh flex-col bg-background pb-10">
    <TopBar title="회원권" />

    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pt-4">
      <Skeleton className="h-12 w-full rounded-xl" />

      <ul className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i}>
            <div className="flex items-center gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
              <Skeleton className="size-11 shrink-0 rounded-xl bg-primary-container/30" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-[min(100%,11rem)]" />
                <Skeleton className="h-3 w-[min(100%,8rem)]" />
                <Skeleton className="h-3.5 w-[min(100%,15rem)]" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="size-5 shrink-0 rounded-sm opacity-60" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default MembershipsListSkeleton;
