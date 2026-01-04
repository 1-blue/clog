import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import type { Metadata, NextPage } from "next";
import InquiryDetailPage from "./_source/components/InquiryDetailPage";

export const metadata: Metadata = getSharedMetadata({ title: "문의 상세" });

interface IProps {
  params: Promise<{ inquiryId: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { inquiryId } = await params;

  return <InquiryDetailPage inquiryId={inquiryId} />;
};

export default Page;
