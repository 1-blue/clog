import type { Metadata, NextPage } from "next";
import RecordCreatePage from "./_source/components/RecordCreatePage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({
  title: "클라이밍 기록 생성",
});

const Page: NextPage = () => {
  return <RecordCreatePage />;
};

export default Page;
