import type { Metadata, NextPage } from "next";
import PassEditPage from "./_source/components/PassEditPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "회원권 수정" });

interface IProps {
  params: Promise<{ passId: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { passId } = await params;

  return <PassEditPage passId={passId} />;
};

export default Page;
