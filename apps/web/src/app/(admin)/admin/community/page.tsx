import { Suspense } from "react";
import type { Metadata, NextPage } from "next";
import AdminCommunitiesPage from "./_source/components/AdminCommunitiesPage";
import AdminCommunitiesPageSkeleton from "./_source/components/AdminCommunitiesPageSkeleton";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "커뮤니티 관리" });

const Page: NextPage = () => {
  return (
    <AdminErrorBoundary>
      <Suspense fallback={<AdminCommunitiesPageSkeleton />}>
        <AdminCommunitiesPage />
      </Suspense>
    </AdminErrorBoundary>
  );
};

export default Page;
