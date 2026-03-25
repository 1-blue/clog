"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { FileText, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

import { categoryToKoreanMap, type CommunityCategory } from "@clog/utils";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

/** 스티치「홈 피드」— 커뮤니티 인기글 (썸네일 + 가로형 카드) */
const CommunityPreviewSection = () => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/posts",
    { params: { query: { limit: 3 } } },
    { select: (d) => d.payload },
  );
  const recentPosts = data?.items ?? [];

  return (
    <section className="pb-4">
      <h2 className="mb-6 text-lg font-bold text-on-surface">
        커뮤니티 인기글
      </h2>

      <div className="space-y-6">
        {recentPosts.map((post, index) => (
          <div key={post.id} className="group flex gap-4">
            <Link
              href={ROUTES.COMMUNITY.DETAIL.path(post.id)}
              className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-highest"
            >
              {post.images[0]?.url ? (
                <img
                  src={post.images[0].url}
                  alt=""
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <FileText
                    className="size-8 text-on-surface-variant"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
              )}
            </Link>
            <div
              className={cn(
                "min-w-0 flex-1 pb-4",
                index < recentPosts.length - 1 && "border-b border-white/5",
              )}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-primary-container uppercase">
                  {categoryToKoreanMap[post.category as CommunityCategory]}
                </span>
                <span className="text-xs text-outline">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
              </div>
              <Link href={ROUTES.COMMUNITY.DETAIL.path(post.id)}>
                <h3 className="mb-2 line-clamp-1 text-sm font-medium text-on-surface/90">
                  {post.title}
                </h3>
              </Link>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    (post.likes?.length ?? 0) > 0 && "text-primary",
                  )}
                >
                  <Heart
                    className="size-3.5 shrink-0"
                    strokeWidth={2}
                    fill={
                      (post.likes?.length ?? 0) > 0
                        ? "currentColor"
                        : "transparent"
                    }
                    aria-hidden
                  />
                  {post.likeCount}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <MessageCircle
                    className="size-3.5 shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {post.commentCount}
                </span>
              </div>
            </div>
          </div>
        ))}
        {recentPosts.length === 0 && (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            아직 게시글이 없습니다
          </p>
        )}
      </div>

      <Link
        href={ROUTES.COMMUNITY.path}
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-surface-container py-4 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
      >
        커뮤니티 더보기
      </Link>
    </section>
  );
};

export default CommunityPreviewSection;
