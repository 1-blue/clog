import { Metadata, NextPage } from "next";

import { getSharedMetadata } from "#web/libs/sharedMetadata";

import CommunityPostCreateMain from "../_source/components/community-post-create/CommunityPostCreateMain";

export const metadata: Metadata = getSharedMetadata({
  title: "커뮤니티 글쓰기",
});

const CommunityCreatePostPage: NextPage = () => {
  return <CommunityPostCreateMain />;
};

export default CommunityCreatePostPage;
