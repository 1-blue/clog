import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import CommunityCreatePage from "./_source/components/CommunityCreatePage";

export const metadata: Metadata = getSharedMetadata({
  title: "커뮤니티 생성",
});

const Page: NextPage = () => {
  return <CommunityCreatePage />;
};

export default Page;
