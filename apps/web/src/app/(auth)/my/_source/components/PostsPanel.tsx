"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import type { CommunityCategory } from "@clog/utils";

import CommunityFeedPostCard from "#web/app/(public)/community/_components/community-post-list/CommunityFeedPostCard";
import EmptyState from "#web/components/shared/EmptyState";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import { ROUTES } from "#web/constants";

interface IProps {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    category: CommunityCategory;
    author: {
      id: string;
      nickname: string;
      profileImage: string | null;
    };
    likeCount: number;
    commentCount: number;
    viewCount: number;
    createdAt: string;
    imageUrls: string[];
    likes?: Array<{ id: string }>;
    bookmarks?: Array<{ id: string }>;
  }>;
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  forceLiked?: boolean;
  forceBookmarked?: boolean;
}

const PostsPanel: React.FC<IProps> = ({
  posts,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  forceLiked = false,
  forceBookmarked = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-surface-container-low"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
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
            imageUrl={post.imageUrls[0]}
            isLiked={forceLiked || (post.likes?.length ?? 0) > 0}
            isBookmarked={forceBookmarked || (post.bookmarks?.length ?? 0) > 0}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default PostsPanel;
