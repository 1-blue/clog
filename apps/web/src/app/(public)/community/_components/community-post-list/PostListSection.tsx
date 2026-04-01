"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { communityCategoryEnum, type CommunityCategory } from "@clog/utils";

import { fetchClient } from "#web/apis/openapi";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";

import CommunityPostCard from "./CommunityPostCard";
import CommunityPostListEmpty from "./CommunityPostListEmpty";
import PostListSkeleton from "./PostListSkeleton";

const PostListSection = () => {
  const searchParams = useSearchParams();
  const categoryRaw = searchParams.get("category") ?? "";
  const category = communityCategoryEnum.safeParse(categoryRaw).success
    ? (categoryRaw as CommunityCategory)
    : "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["get", "/api/v1/posts", { category }],
      queryFn: async ({ pageParam }) => {
        const { data: res } = await fetchClient.GET("/api/v1/posts", {
          params: {
            query: {
              cursor: pageParam,
              limit: 20,
              category: category || undefined,
            },
          },
        });
        return res!.payload;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined as string | undefined,
    });

  const posts = data?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) {
    return <PostListSkeleton />;
  }

  if (posts.length === 0) {
    return <CommunityPostListEmpty />;
  }

  return (
    <InfiniteScroll
      onLoadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      isLoading={isFetchingNextPage}
    >
      <div className="space-y-5">
        {posts.map((post) => (
          <CommunityPostCard key={post.id} post={post} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default PostListSection;
