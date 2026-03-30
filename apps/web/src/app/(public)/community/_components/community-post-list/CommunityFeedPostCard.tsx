"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Bookmark, Eye, MessageCircle, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  categoryToKoreanMap,
  postCategoryMap,
  type CommunityCategory,
} from "@clog/utils";

import { Badge } from "#web/components/ui/badge";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

import { formatCompactCount } from "./formatCompactCount";

interface IProps {
  id: string;
  title: string;
  content: string;
  category: CommunityCategory;
  authorId: string;
  authorNickname: string;
  authorImage?: string | null;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string | Date;
  imageUrl?: string | null;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const CommunityFeedPostCard = ({
  id,
  title,
  content,
  category,
  authorId,
  authorNickname,
  authorImage,
  likeCount,
  commentCount,
  viewCount,
  createdAt,
  imageUrl,
  isLiked = false,
  isBookmarked,
}: IProps) => {
  const router = useRouter();
  const detailHref = ROUTES.COMMUNITY.DETAIL.path(id);

  const goDetail = () => {
    void router.push(detailHref);
  };

  const body = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <Badge color={postCategoryMap[category]}>
          {categoryToKoreanMap[category]}
        </Badge>
        <span className="text-xs font-medium text-on-surface-variant">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: ko,
          })}
        </span>
      </div>
      <h2 className="mb-2.5 text-lg leading-snug font-bold tracking-tight text-on-surface">
        {title}
      </h2>
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed font-normal text-on-surface-variant opacity-90">
        {content}
      </p>
      <div className="mb-4 flex items-center gap-2.5">
        <Link
          href={ROUTES.USERS.PROFILE.path(authorId)}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 hover:opacity-90"
        >
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
        </Link>
      </div>
      <div className="flex items-center gap-4 border-t border-outline-variant/10 text-on-surface-variant">
        <div
          className={cn("flex items-center gap-1.5", isLiked && "text-primary")}
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
        {isBookmarked !== undefined && (
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
          </div>
        )}
      </div>
    </>
  );

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goDetail();
        }
      }}
      className="cursor-pointer overflow-hidden rounded-2xl border border-outline-variant/5 bg-surface-container-low transition-all active:scale-95"
    >
      <div className="flex gap-4 p-5">
        <div className="flex-1">{body}</div>
        {imageUrl && (
          <div className="size-24 shrink-0 overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt=""
              className="size-full object-cover opacity-90"
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default CommunityFeedPostCard;
