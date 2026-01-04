import type { NextPage } from "next";
import RecordEditPage from "./_source/components/RecordEditPage";

interface IProps {
  params: Promise<{ recordId: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { recordId } = await params;

  return <RecordEditPage recordId={recordId} />;
};

export default Page;
