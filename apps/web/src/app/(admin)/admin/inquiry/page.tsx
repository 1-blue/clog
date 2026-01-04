import type { Metadata, NextPage } from "next";
import AdminInquiryPage from "./_source/components/AdminInquiriesPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "암장 관리" });

const Page: NextPage = () => {
  return <AdminInquiryPage />;
};

export default Page;
