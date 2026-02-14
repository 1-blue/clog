import type { NextPage } from "next";
import AdminGymCreatePage from "./_source/components/AdminGymCreatePage";
import GymErrorBoundary from "#/src/components/error-boundary/GymErrorBoundary";

const Page: NextPage = () => {
  return (
    <GymErrorBoundary>
      <AdminGymCreatePage />
    </GymErrorBoundary>
  );
};

export default Page;
