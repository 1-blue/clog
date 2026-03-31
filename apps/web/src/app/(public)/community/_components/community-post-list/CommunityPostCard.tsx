"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Bookmark, Eye, MessageCircle, ThumbsUp, User } from "lucide-react";
import Link from "next/link";

import {
  categoryToKoreanMap,
  postCategoryMap,
  type CommunityCategory,
} from "@clog/utils";

import { components } from "#web/@types/openapi";
import { Badge } from "#web/components/ui/badge";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

import { formatCompactCount } from "./formatCompactCount";

type TPost = components["schemas"]["PostListItem"];

type TCommunityPostCardProps =
  | { post: TPost }
  | {
      id: string;
      title: string;
      content: string;
      category: CommunityCategory;
      authorId: string;
      authorNickname: string;
      authorImage: string | null;
      likeCount: number;
      commentCount: number;
      viewCount: number;
      createdAt: string;
      imageUrl?: string;
      isLiked: boolean;
      isBookmarked: boolean;
      tags?: string[];
      bookmarkCount?: number;
    };

const CommunityPostCard: React.FC<TCommunityPostCardProps> = (props) => {
  const isPostVariant = "post" in props;

  let id: string;
  let category: CommunityCategory;
  let title: string;
  let content: string;
  let createdAt: string;
  let imageUrl: string | undefined;

  let likeCount: number;
  let commentCount: number;
  let viewCount: number;

  let isLiked: boolean;
  let isBookmarked: boolean;
  let bookmarkCount: number | undefined;

  let authorNickname: string;
  let authorImage: string | null;

  let tags: string[];

  if (isPostVariant) {
    const post = props.post;
    id = post.id;
    category = post.category;
    title = post.title;
    content = post.content;
    createdAt = post.createdAt;
    imageUrl = post.imageUrls[0];

    likeCount = post.likeCount;
    commentCount = post.commentCount;
    viewCount = post.viewCount;

    isLiked = (post.likes?.length ?? 0) > 0;
    isBookmarked = (post.bookmarks?.length ?? 0) > 0;
    bookmarkCount = post.bookmarks?.length;

    authorNickname = post.author.nickname;
    authorImage = post.author.profileImage;

    tags = post.tags.slice(0, 3);
  } else {
    id = props.id;
    category = props.category;
    title = props.title;
    content = props.content;
    createdAt = props.createdAt;
    imageUrl = props.imageUrl;

    likeCount = props.likeCount;
    commentCount = props.commentCount;
    viewCount = props.viewCount;

    isLiked = props.isLiked;
    isBookmarked = props.isBookmarked;
    bookmarkCount = props.bookmarkCount;

    authorNickname = props.authorNickname;
    authorImage = props.authorImage;

    tags = (props.tags ?? []).slice(0, 3);
  }

  const detailHref = ROUTES.COMMUNITY.DETAIL.path(id);

  const createdAtLabel = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Link
      href={detailHref}
      className="mx-auto block w-full max-w-[480px] overflow-hidden rounded-2xl border border-outline-variant/5 bg-surface-container-low transition-all active:scale-95"
    >
      <div className="flex flex-col">
        {imageUrl ? (
          <div className="relative aspect-video w-full overflow-hidden bg-surface-container-highest">
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 size-full object-cover object-center opacity-90"
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <Badge color={postCategoryMap[category]}>
              {categoryToKoreanMap[category]}
            </Badge>
            <span className="text-xs font-medium text-on-surface-variant">
              {createdAtLabel}
            </span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-outline-variant/10 bg-background px-2 py-1 text-[11px] font-semibold text-on-surface-variant"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h2 className="line-clamp-1 text-lg leading-snug font-bold tracking-tight text-on-surface">
            {title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed font-normal text-on-surface-variant opacity-90">
            {content}
          </p>

          <div className="flex items-center gap-2">
            <div className="size-6 shrink-0 overflow-hidden rounded-full bg-surface-container-highest ring-1 ring-outline-variant/20">
              {authorImage ? (
                <img
                  src={authorImage}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <User
                    className="size-3.5 text-on-surface-variant"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-on-surface-variant">
              {authorNickname}
            </span>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-outline-variant/10 pt-2 text-on-surface-variant">
            <div
              className={cn(
                "flex items-center gap-1.5",
                isLiked && "text-primary",
              )}
            >
              <ThumbsUp
                className={cn("size-5", isLiked && "fill-primary")}
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-xs font-semibold">
                {likeCount.toLocaleString("ko-KR")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="size-5" strokeWidth={2} aria-hidden />
              <span className="text-xs font-semibold">
                {commentCount.toLocaleString("ko-KR")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="size-5" strokeWidth={2} aria-hidden />
              <span className="text-xs font-semibold">
                {formatCompactCount(viewCount)}
              </span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5",
                isBookmarked && "text-secondary",
              )}
            >
              <Bookmark
                className={cn("size-5", isBookmarked && "fill-secondary")}
                strokeWidth={2}
                aria-hidden
              />
              {typeof bookmarkCount === "number" ? (
                <span className="text-xs font-semibold">
                  {bookmarkCount.toLocaleString("ko-KR")}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityPostCard;
