"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Eye,
  MessageCircle,
  ThumbsUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { categoryToKoreanMap, type CommunityCategory } from "@clog/utils";

import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

import { communityCategoryBadgeClassMap } from "../community-category/categoryBadgeClassMap";
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
}: IProps) => {
  const router = useRouter();
  const detailHref = ROUTES.COMMUNITY.DETAIL.path(id);
  const badgeClass = communityCategoryBadgeClassMap[category];

  const goDetail = () => {
    void router.push(detailHref);
  };

  const body = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            "rounded px-2 py-0.5 text-xs font-bold tracking-wide",
            badgeClass,
          )}
        >
          {categoryToKoreanMap[category]}
        </span>
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
      <div className="flex items-center gap-4 border-t border-outline-variant/10 pt-4 text-on-surface-variant">
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
      {imageUrl ? (
        <div className="flex flex-col sm:flex-row">
          <div className="order-2 flex-1 p-5 sm:order-1">{body}</div>
          <div className="relative order-1 h-44 w-full shrink-0 overflow-hidden sm:order-2 sm:h-auto sm:min-h-44 sm:w-40">
            <img
              src={imageUrl}
              alt=""
              className="size-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent sm:bg-linear-to-l" />
          </div>
        </div>
      ) : (
        <div className="p-5">{body}</div>
      )}
    </article>
  );
};

export default CommunityFeedPostCard;
