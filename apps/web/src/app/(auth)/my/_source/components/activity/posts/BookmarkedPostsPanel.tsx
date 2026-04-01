"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import Link from "next/link";

import CommunityPostCard from "#web/app/(public)/community/_components/community-post-list/CommunityPostCard";
import { fetchClient } from "#web/apis/openapi";
import EmptyState from "#web/components/shared/EmptyState";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import { ROUTES } from "#web/constants";

import BookmarkedPostsPanelSkeleton from "./BookmarkedPostsPanelSkeleton";

const BookmarkedPostsPanel = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["get", "/api/v1/users/me/bookmarked-posts"],
      queryFn: async ({ pageParam }) => {
        const { data: res } = await fetchClient.GET(
          "/api/v1/users/me/bookmarked-posts",
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
    return <BookmarkedPostsPanelSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="저장한 글이 없습니다"
        description="마음에 드는 글을 북마크해 보세요."
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
          <CommunityPostCard key={post.id} post={post} forceBookmarked />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default BookmarkedPostsPanel;
