import { Suspense } from "react";
import type { Metadata } from "next";
import AdminGymPage from "./_source/components/AdminGymPage";
import AdminGymPageSkeleton from "./_source/components/AdminGymPageSkeleton";
import GymErrorBoundary from "#/src/components/error-boundary/GymErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "암장 관리" });

const Page = () => {
  return (
    <GymErrorBoundary>
      <Suspense fallback={<AdminGymPageSkeleton />}>
        <AdminGymPage />
      </Suspense>
    </GymErrorBoundary>
  );
};

export default Page;
