import { Suspense } from "react";
import type { Metadata, NextPage } from "next";
import AdminPassesPage from "./_source/components/AdminPassesPage";
import AdminPassesPageSkeleton from "./_source/components/AdminPassesPageSkeleton";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "회원권 관리" });

const Page: NextPage = () => {
  return (
    <AdminErrorBoundary>
      <Suspense fallback={<AdminPassesPageSkeleton />}>
        <AdminPassesPage />
      </Suspense>
    </AdminErrorBoundary>
  );
};

export default Page;
