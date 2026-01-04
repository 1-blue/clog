import type { Metadata, NextPage } from "next";
import InquiryCreatePage from "./_source/components/InquiryCreatePage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "문의 생성" });

const Page: NextPage = () => {
  return <InquiryCreatePage />;
};

export default Page;
