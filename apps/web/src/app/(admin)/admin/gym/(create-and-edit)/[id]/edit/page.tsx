import { Suspense } from "react";
import type { NextPage } from "next";
import AdminGymEditPage from "./_source/components/AdminGymEditPage";
import AdminGymEditPageSkeleton from "./_source/components/AdminGymEditPageSkeleton";
import GymErrorBoundary from "#/src/components/error-boundary/GymErrorBoundary";

interface IProps {
  params: Promise<{ id: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <GymErrorBoundary>
      <Suspense fallback={<AdminGymEditPageSkeleton />}>
        <AdminGymEditPage gymId={id} />
      </Suspense>
    </GymErrorBoundary>
  );
};

export default Page;
