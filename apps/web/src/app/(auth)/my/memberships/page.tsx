import { Suspense } from "react";
import { Metadata } from "next";

import { getSharedMetadata } from "#web/libs/sharedMetadata";
import { Skeleton } from "#web/components/ui/skeleton";

import MembershipsListMain from "./_source/components/MembershipsListMain";

export const metadata: Metadata = getSharedMetadata({
  title: "회원권",
});

const MembershipsListSkeleton = () => (
  <div className="mx-auto flex w-full max-w-lg flex-col gap-3 p-4">
    <Skeleton className="h-10 w-full rounded-xl" />
    <Skeleton className="h-24 w-full rounded-2xl" />
    <Skeleton className="h-24 w-full rounded-2xl" />
  </div>
);

const MembershipsPage = () => (
  <Suspense fallback={<MembershipsListSkeleton />}>
    <MembershipsListMain />
  </Suspense>
);

export default MembershipsPage;
