import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import GuideGradePage from "./_source/components/GuideGradePage";

export const metadata: Metadata = getSharedMetadata({
  title: "난이도 가이드",
});

const Page: NextPage = () => {
  return <GuideGradePage />;
};

export default Page;
