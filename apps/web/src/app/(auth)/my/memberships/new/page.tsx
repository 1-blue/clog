import { Suspense } from "react";
import { Metadata } from "next";

import { Skeleton } from "#web/components/ui/skeleton";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import MembershipNewMain from "./_source/components/MembershipNewMain";

export const metadata: Metadata = getSharedMetadata({
  title: "회원권 등록",
});

const SkeletonUi = () => (
  <div className="mx-auto max-w-lg space-y-4 p-4">
    <Skeleton className="h-12 w-full rounded-xl" />
    <Skeleton className="h-40 w-full rounded-2xl" />
  </div>
);

const Page = () => (
  <Suspense fallback={<SkeletonUi />}>
    <MembershipNewMain />
  </Suspense>
);

export default Page;
