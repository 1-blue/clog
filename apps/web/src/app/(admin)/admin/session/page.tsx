import { Suspense } from "react";
import type { Metadata, NextPage } from "next";
import AdminSessionsPage from "./_source/components/AdminSessionsPage";
import AdminSessionsPageSkeleton from "./_source/components/AdminSessionsPageSkeleton";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "세션 관리" });

const Page: NextPage = () => {
  return (
    <AdminErrorBoundary>
      <Suspense fallback={<AdminSessionsPageSkeleton />}>
        <AdminSessionsPage />
      </Suspense>
    </AdminErrorBoundary>
  );
};

export default Page;
