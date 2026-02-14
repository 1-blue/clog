import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import type { Metadata, NextPage } from "next";
import AdminPage from "./_source/components/AdminPage";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";

export const metadata: Metadata = getSharedMetadata({ title: "관리자" });

const Page: NextPage = () => {
  return (
    <AdminErrorBoundary>
      <AdminPage />
    </AdminErrorBoundary>
  );
};

export default Page;
