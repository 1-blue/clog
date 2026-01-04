import type { Metadata, NextPage } from "next";
import RecordDetailPage from "./_source/components/RecordDetailPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

// TODO: 클라이밍 기록 상세 메타데이터 수정하기
export const metadata: Metadata = getSharedMetadata({
  title: "클라이밍 기록 상세",
});

interface IProps {
  params: Promise<{ recordId: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { recordId } = await params;

  return <RecordDetailPage recordId={recordId} />;
};

export default Page;
