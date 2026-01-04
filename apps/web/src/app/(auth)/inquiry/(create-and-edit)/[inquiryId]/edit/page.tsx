import type { Metadata, NextPage } from "next";
import InquiryEditPage from "./_source/components/InquieryEditPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "문의 수정" });

interface IProps {
  params: Promise<{ inquiryId: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { inquiryId } = await params;

  return <InquiryEditPage inquiryId={inquiryId} />;
};

export default Page;
