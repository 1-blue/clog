import type { Metadata, NextPage } from "next";
import AdminCommunityPage from "./_source/components/AdminCommunitiesPage";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";

export const metadata: Metadata = getSharedMetadata({ title: "커뮤니티 관리" });

const Page: NextPage = () => {
  return <AdminCommunityPage />;
};

export default Page;
