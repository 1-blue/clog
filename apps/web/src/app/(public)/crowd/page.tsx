import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import CrowdPage from "./_source/components/CrowdPage";

export const metadata: Metadata = getSharedMetadata({
  title: "실시간 혼잡도",
});

const Page: NextPage = () => {
  return <CrowdPage />;
};

export default Page;
