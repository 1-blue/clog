"use client";

import { openapi } from "#web/apis/openapi";

import CommunityCard from "./CommunityCard";

const CommunityCardList: React.FC = () => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/posts",
    { params: { query: { limit: 3 } } },
    { select: (d) => d.payload },
  );
  const recentPosts = data?.items ?? [];

  return (
    <div className="flex flex-col gap-3">
      {recentPosts.map((post) => (
        <CommunityCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default CommunityCardList;
