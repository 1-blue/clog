import { Suspense } from "react";
import type { Metadata } from "next";

import AppTopBar from "#web/components/layout/AppTopBar";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import RecordsList from "./_source/components/records-list/RecordsList";
import RecordsListSkeleton from "./_source/components/records-list/RecordsListSkeleton";

export const revalidate = 0;

export const generateMetadata = async (): Promise<Metadata> =>
  getSharedMetadata({
    title: "기록",
    keywords: ["기록", "클라이밍", "세션", "월별"],
  });

const RecordsPage = () => (
  <div>
    <AppTopBar
      left={<span className="text-lg font-bold text-on-surface">기록</span>}
    />

    <Suspense fallback={<RecordsListSkeleton />}>
      <RecordsList />
    </Suspense>
  </div>
);

export default RecordsPage;
