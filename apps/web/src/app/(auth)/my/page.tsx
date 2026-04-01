import { Suspense } from "react";
import { Metadata } from "next";

import { getSharedMetadata } from "#web/libs/sharedMetadata";

import MyActivitySection from "./_source/components/activity/MyActivitySection";
import MyActivitySectionSkeleton from "./_source/components/activity/MyActivitySectionSkeleton";
import ProfileSummarySection from "./_source/components/ProfileSummarySection";
import ProfileSummarySkeleton from "./_source/components/skeleton/ProfileSummarySkeleton";

export const metadata: Metadata = getSharedMetadata({
  title: "마이페이지",
});

const MyPage = () => {
  return (
    <div className="pb-8">
      <Suspense fallback={<ProfileSummarySkeleton />}>
        <ProfileSummarySection />
      </Suspense>

      <Suspense fallback={<MyActivitySectionSkeleton />}>
        <MyActivitySection />
      </Suspense>
    </div>
  );
};
export default MyPage;
