import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import GuideClimbingPage from "./_source/components/GuideClimbingPage";

export const metadata: Metadata = getSharedMetadata({
  title: "실내 클라이밍 가이드",
});

const Page: NextPage = () => {
  return <GuideClimbingPage />;
};

export default Page;
