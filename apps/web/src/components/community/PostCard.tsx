"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Bookmark, Heart, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { categoryToKoreanMap, type CommunityCategory } from "@clog/utils";

import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

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
  createdAt: string | Date;
  imageUrl?: string | null;
  /** 로그인 사용자가 좋아요한 경우 채움 아이콘 */
  isLiked?: boolean;
  /** 저장함(북마크) — 채움 아이콘 표시 */
  isBookmarked?: boolean;
}

const PostCard: React.FC<IProps> = ({
  id,
  title,
  content,
  category,
  authorId,
  authorNickname,
  authorImage,
  likeCount,
  commentCount,
  createdAt,
  imageUrl,
  isLiked = false,
  isBookmarked = false,
}) => {
  const router = useRouter();
  const detailHref = ROUTES.COMMUNITY.DETAIL.path(id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(detailHref)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(detailHref);
        }
      }}
      className="block cursor-pointer rounded-2xl bg-surface-container-low p-4 text-left transition-colors hover:bg-surface-container"
    >
      <div className="flex gap-3">
        <div className="flex-1">
          {/* 카테고리 + 시간 */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="rounded bg-primary-container px-1.5 py-0.5 text-xs font-medium text-on-primary-container">
              {categoryToKoreanMap[category]}
            </span>
            <span>
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>

          {/* 제목 + 본문 미리보기 */}
          <h3 className="mt-1.5 line-clamp-1 font-semibold text-on-surface">
            {title}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-on-surface-variant">
            {content}
          </p>

          {/* 작성자 + 반응 */}
          <div className="mt-2 flex items-center gap-3 text-xs text-on-surface-variant">
            <Link
              href={ROUTES.USERS.PROFILE.path(authorId)}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-primary"
            >
              {authorImage ? (
                <img
                  src={authorImage}
                  alt=""
                  className="size-4 rounded-full object-cover"
                />
              ) : (
                <User className="size-3.5" />
              )}
              <span>{authorNickname}</span>
            </Link>
            <div
              className={cn(
                "flex items-center gap-0.5",
                isLiked && "text-primary",
              )}
            >
              <Heart
                className="size-3.5"
                fill={isLiked ? "currentColor" : "none"}
              />
              <span>{likeCount}</span>
            </div>
            {isBookmarked && (
              <div className="flex items-center gap-0.5 text-secondary">
                <Bookmark className="size-3.5 fill-current" />
              </div>
            )}
            <div className="flex items-center gap-0.5">
              <MessageCircle className="size-3.5" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>

        {/* 썸네일 */}
        {imageUrl && (
          <div className="size-16 shrink-0 overflow-hidden rounded-xl">
            <img src={imageUrl} alt="" className="size-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};
export default PostCard;
