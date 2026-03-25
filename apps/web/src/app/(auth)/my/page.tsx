import { Suspense } from "react";

import MyActivitySection from "./_source/components/MyActivitySection";
import ProfileSummarySection from "./_source/components/ProfileSummarySection";
import MyActivitySkeleton from "./_source/components/skeleton/MyActivitySkeleton";
import ProfileSummarySkeleton from "./_source/components/skeleton/ProfileSummarySkeleton";

const MyPage = () => {
  return (
    <div className="pb-8">
      <Suspense fallback={<ProfileSummarySkeleton />}>
        <ProfileSummarySection />
      </Suspense>
      <Suspense fallback={<MyActivitySkeleton />}>
        <MyActivitySection />
      </Suspense>
    </div>
  );
};
export default MyPage;
