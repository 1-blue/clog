import { Suspense } from "react";
import { Metadata } from "next";

import { Skeleton } from "#web/components/ui/skeleton";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import MembershipEditMain from "./_source/components/MembershipEditMain";

export const metadata: Metadata = getSharedMetadata({
  title: "회원권 수정",
});

interface IProps {
  params: Promise<{ id: string }>;
}

const SkeletonUi = () => (
  <div className="mx-auto max-w-lg space-y-4 p-4">
    <Skeleton className="h-40 w-full rounded-2xl" />
  </div>
);

const Page = async ({ params }: IProps) => {
  const { id } = await params;
  return (
    <Suspense fallback={<SkeletonUi />}>
      <MembershipEditMain userMembershipId={id} />
    </Suspense>
  );
};

export default Page;
