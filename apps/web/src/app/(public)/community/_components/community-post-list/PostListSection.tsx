"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { CommunityCategory } from "@clog/utils";

import { fetchClient } from "#web/apis/openapi";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";

import CommunityFeedPostCard from "./CommunityFeedPostCard";
import CommunityPostListEmpty from "./CommunityPostListEmpty";
import PostListSkeleton from "./PostListSkeleton";

interface IProps {
  category: CommunityCategory | "";
}

const PostListSection = ({ category }: IProps) => {
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
          <CommunityFeedPostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            category={post.category}
            authorId={post.author.id}
            authorNickname={post.author.nickname}
            authorImage={post.author.profileImage}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            viewCount={post.viewCount}
            createdAt={post.createdAt}
            imageUrl={post.images?.[0]?.url}
            isLiked={(post.likes?.length ?? 0) > 0}
            isBookmarked={(post.bookmarks?.length ?? 0) > 0}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default PostListSection;
