import TopBar from "#web/components/layout/TopBar";

import RecordsListSkeleton from "./_source/components/records-list/RecordsListSkeleton";

/** 세그먼트 로딩 시에도 `page.tsx`와 동일하게 TopBar 유지 */
const RecordsLoading = () => (
  <div>
    <TopBar
      left={<span className="text-lg font-bold text-on-surface">기록</span>}
    />
    <RecordsListSkeleton />
  </div>
);

export default RecordsLoading;
