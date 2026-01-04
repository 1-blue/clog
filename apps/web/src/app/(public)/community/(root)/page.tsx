import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import CommunityPage from "./_source/components/CommunityPage";

export const metadata: Metadata = getSharedMetadata({
  title: "커뮤니티",
});

const Page: NextPage = () => {
  return <CommunityPage />;
};

export default Page;
