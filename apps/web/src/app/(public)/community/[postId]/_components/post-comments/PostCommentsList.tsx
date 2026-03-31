"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchClient } from "#web/apis/openapi";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";

import PostCommentBlock from "./PostCommentBlock";

interface IProps {
  postId: string;
  postAuthorId: string;
  onReply?: (commentId: string) => void;
}

const PostCommentsList: React.FC<IProps> = ({
  postId,
  postAuthorId,
  onReply,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["get", "/api/v1/posts/{postId}/comments", { postId }],
      queryFn: async ({ pageParam }) => {
        const { data: res } = await fetchClient.GET(
          "/api/v1/posts/{postId}/comments",
          {
            params: {
              path: { postId },
              query: { cursor: pageParam, limit: 20 },
            },
          },
        );
        return res!.payload;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined as string | undefined,
    });

  const comments = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <InfiniteScroll
      onLoadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      isLoading={isFetchingNextPage}
    >
      <div className="flex flex-col gap-10">
        {comments.map((c) => (
          <PostCommentBlock
            key={c.id}
            postId={postId}
            comment={c}
            postAuthorId={postAuthorId}
            onReply={onReply}
          />
        ))}
        {comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            아직 댓글이 없어요
          </p>
        ) : null}
      </div>
    </InfiniteScroll>
  );
};

export default PostCommentsList;
