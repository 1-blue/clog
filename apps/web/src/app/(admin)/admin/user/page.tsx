import { Suspense } from "react";
import type { Metadata, NextPage } from "next";
import AdminUsersPage from "./_source/components/AdminUsersPage";
import AdminUsersPageSkeleton from "./_source/components/AdminUsersPageSkeleton";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "사용자 관리" });

const Page: NextPage = () => {
  return (
    <AdminErrorBoundary>
      <Suspense fallback={<AdminUsersPageSkeleton />}>
        <AdminUsersPage />
      </Suspense>
    </AdminErrorBoundary>
  );
};

export default Page;
