"use client";

import { openapi } from "#web/apis/openapi";
import { Button } from "#web/components/ui/button";
import { Card, CardContent } from "#web/components/ui/card";
import { ROUTES } from "#web/constants";

import CommunityCard from "./CommunityCard";

const CommunityCardList: React.FC = () => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/posts",
    { params: { query: { limit: 3 } } },
    { select: (d) => d.payload },
  );
  const recentPosts = data?.items ?? [];

  if (recentPosts.length === 0) {
    return (
      <Card className="border-outline-variant/50 bg-surface-container-low shadow-none ring-1 ring-outline-variant/30">
        <CardContent className="flex flex-col items-center gap-4 py-3 text-center">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium text-on-surface">
              아직 게시글이 없어요
            </div>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              커뮤니티에서 첫 글을 남기거나, 전체 글을 둘러보세요.
            </p>
          </div>
          <div className="flex w-full max-w-sm gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => (window.location.href = ROUTES.COMMUNITY.path)}
            >
              전체 보기
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() =>
                (window.location.href = ROUTES.COMMUNITY.CREATE.path)
              }
            >
              첫 글 쓰기
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {recentPosts.map((post) => (
        <CommunityCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default CommunityCardList;
