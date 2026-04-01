"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Link from "next/link";

import CommunityPostCard from "#web/app/(public)/community/_components/community-post-list/CommunityPostCard";
import { fetchClient } from "#web/apis/openapi";
import EmptyState from "#web/components/shared/EmptyState";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import { ROUTES } from "#web/constants";

import LikedPostsPanelSkeleton from "./LikedPostsPanelSkeleton";

const LikedPostsPanel = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["get", "/api/v1/users/me/liked-posts"],
      queryFn: async ({ pageParam }) => {
        const { data: res } = await fetchClient.GET(
          "/api/v1/users/me/liked-posts",
          {
            params: { query: { cursor: pageParam, limit: 20 } },
          },
        );
        return res!.payload;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined as string | undefined,
    });

  const posts = data?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) {
    return <LikedPostsPanelSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="좋아요한 글이 없습니다"
        description="커뮤니티에서 공감 가는 글에 하트를 눌러 보세요."
        action={
          <Link
            href={ROUTES.COMMUNITY.path}
            className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            커뮤니티 가기
          </Link>
        }
      />
    );
  }

  return (
    <InfiniteScroll
      onLoadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      isLoading={isFetchingNextPage}
    >
      <div className="space-y-5">
        {posts.map((post) => (
          <CommunityPostCard key={post.id} post={post} forceLiked />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default LikedPostsPanel;
