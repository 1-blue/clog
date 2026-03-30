import { Suspense } from "react";
import type { Metadata } from "next";

import AppTopBar from "#web/components/layout/AppTopBar";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import RecordsListSection from "./_source/components/RecordsListSection";
import RecordsListSkeleton from "./_source/components/RecordsListSkeleton";

export const revalidate = 0;

export const generateMetadata = async (): Promise<Metadata> =>
  getSharedMetadata({
    title: "기록",
    keywords: ["기록", "클라이밍", "세션", "월별"],
  });

const RecordsPage = () => (
  <div className="pb-24">
    <AppTopBar
      left={<span className="text-lg font-bold text-on-surface">기록</span>}
    />

    <Suspense fallback={<RecordsListSkeleton />}>
      <RecordsListSection />
    </Suspense>
  </div>
);

export default RecordsPage;
