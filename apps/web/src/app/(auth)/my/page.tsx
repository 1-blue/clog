import { Suspense } from "react";

import MyActivitySection from "./_source/components/activity/MyActivitySection";
import MyActivitySectionSkeleton from "./_source/components/activity/MyActivitySectionSkeleton";
import ProfileSummarySection from "./_source/components/ProfileSummarySection";
import ProfileSummarySkeleton from "./_source/components/skeleton/ProfileSummarySkeleton";

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
