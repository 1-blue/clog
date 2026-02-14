import { Suspense } from "react";
import type { Metadata, NextPage } from "next";
import AdminReportsPage from "./_source/components/AdminReportsPage";
import AdminReportsPageSkeleton from "./_source/components/AdminReportsPageSkeleton";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "신고 관리" });

const Page: NextPage = () => {
  return (
    <AdminErrorBoundary>
      <Suspense fallback={<AdminReportsPageSkeleton />}>
        <AdminReportsPage />
      </Suspense>
    </AdminErrorBoundary>
  );
};

export default Page;
