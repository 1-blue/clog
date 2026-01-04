import type { Metadata, NextPage } from "next";
import InquiryPage from "./_source/components/InquiryPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "문의" });

const Page: NextPage = () => {
  return <InquiryPage />;
};

export default Page;
