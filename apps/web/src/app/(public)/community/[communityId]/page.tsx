import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import CommunityDetailPage from "./_source/components/CommunityDetailPage";

export const metadata: Metadata = getSharedMetadata({
  title: "커뮤니티 상세",
});

interface IProps {
  params: Promise<{ communityId: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { communityId } = await params;

  return <CommunityDetailPage communityId={communityId} />;
};

export default Page;
