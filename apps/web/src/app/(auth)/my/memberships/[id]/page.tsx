import { Suspense } from "react";
import { Metadata } from "next";

import { Skeleton } from "#web/components/ui/skeleton";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import MembershipDetailMain from "./_source/components/MembershipDetailMain";

export const metadata: Metadata = getSharedMetadata({
  title: "회원권 상세",
});

interface IProps {
  params: Promise<{ id: string }>;
}

const SkeletonUi = () => (
  <div className="mx-auto max-w-lg space-y-4 p-4">
    <Skeleton className="h-32 w-full rounded-2xl" />
  </div>
);

const Page = async ({ params }: IProps) => {
  const { id } = await params;
  return (
    <Suspense fallback={<SkeletonUi />}>
      <MembershipDetailMain userMembershipId={id} />
    </Suspense>
  );
};

export default Page;
