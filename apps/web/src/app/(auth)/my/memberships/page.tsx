import { Suspense } from "react";
import { Metadata } from "next";

import { getSharedMetadata } from "#web/libs/sharedMetadata";

import MembershipsListMain from "./_source/components/MembershipsListMain";
import MembershipsListSkeleton from "./_source/components/MembershipsListSkeleton";

export const metadata: Metadata = getSharedMetadata({
  title: "회원권",
});

const MembershipsPage = () => (
  <Suspense fallback={<MembershipsListSkeleton />}>
    <MembershipsListMain />
  </Suspense>
);

export default MembershipsPage;
