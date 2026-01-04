import type { Metadata, NextPage } from "next";
import RecordPage from "./_source/components/RecordPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "클라이밍 기록" });

const Page: NextPage = () => {
  return <RecordPage />;
};

export default Page;
