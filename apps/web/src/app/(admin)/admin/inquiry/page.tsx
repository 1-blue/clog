import type { Metadata, NextPage } from "next";
import AdminInquiryPage from "./_source/components/AdminInquiriesPage";
import AdminErrorBoundary from "#/src/components/error-boundary/AdminErrorBoundary";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "문의 관리" });

const Page: NextPage = () => {
  return (
    <AdminErrorBoundary>
      <AdminInquiryPage />
    </AdminErrorBoundary>
  );
};

export default Page;
