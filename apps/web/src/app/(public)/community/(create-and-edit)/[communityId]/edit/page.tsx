import type { Metadata, NextPage } from "next";
import { getSharedMetadata } from "#/src/libs/sharedMetadata";
import CommunityEditPage from "./_source/components/CommunityEditPage";

export const metadata: Metadata = getSharedMetadata({
  title: "커뮤니티 수정",
});

interface IProps {
  params: Promise<{ communityId: string }>;
}

const Page: NextPage<IProps> = async ({ params }) => {
  const { communityId } = await params;

  return <CommunityEditPage communityId={communityId} />;
};

export default Page;
