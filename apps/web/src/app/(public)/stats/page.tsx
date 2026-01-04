import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import StatsPage from "./_source/components/StatsPage";

export const metadata: Metadata = getSharedMetadata({
  title: "통계",
});

const Page: NextPage = () => {
  return <StatsPage />;
};

export default Page;
