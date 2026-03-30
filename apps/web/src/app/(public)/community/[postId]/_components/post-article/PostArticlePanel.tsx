"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Eye, User } from "lucide-react";
import Link from "next/link";

import { categoryToKoreanMap, type CommunityCategory } from "@clog/utils";

import type { components } from "#web/@types/openapi";
import { ROUTES } from "#web/constants";

type PostDetailPayload = components["schemas"]["PostDetail"];

interface IProps {
  post: PostDetailPayload;
}

const PostArticlePanel = ({ post }: IProps) => {
  const cover = post.images[0];
  const timeRel = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <>
      {cover ? (
        <div className="relative -mx-6 aspect-4/5 w-screen max-w-none overflow-hidden bg-surface-container-low shadow-2xl sm:mx-0 sm:w-full sm:rounded-2xl">
          <img src={cover.url} alt="" className="size-full object-cover" />
        </div>
      ) : null}

      <section className={cover ? "mt-8" : "mt-4"}>
        <span className="mb-3 inline-block rounded-full bg-primary-container/20 px-3 py-1 text-xs font-bold tracking-wide text-primary">
          {categoryToKoreanMap[post.category as CommunityCategory]}
        </span>
        <h2 className="mb-6 text-3xl leading-tight font-semibold tracking-tight break-keep text-on-surface">
          {post.title}
        </h2>
      </section>

      <section className="mb-8 flex items-center justify-between border-b border-outline-variant/10 pb-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={ROUTES.USERS.PROFILE.path(post.author.id)}
            className="size-11 shrink-0 overflow-hidden rounded-full bg-surface-container-highest ring-1 ring-white/10"
          >
            {post.author.profileImage ? (
              <img
                src={post.author.profileImage}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <User
                  className="size-5 text-on-surface-variant"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <Link
              href={ROUTES.USERS.PROFILE.path(post.author.id)}
              className="block truncate text-sm font-semibold text-on-surface hover:text-primary"
            >
              {post.author.nickname}
            </Link>
            <p className="text-xs text-on-surface-variant">{timeRel}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container/50 px-3 py-1.5 text-xs text-on-surface-variant">
          <Eye className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          <span>{post.viewCount.toLocaleString("ko-KR")}</span>
        </div>
      </section>

      <article className="space-y-6 text-base leading-loose wrap-break-word break-keep text-on-surface">
        <p className="rounded-sm bg-primary/20 px-3 py-1 whitespace-pre-wrap">
          {post.content}
        </p>

        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-6">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="cursor-default rounded-full bg-surface-container-highest/60 px-3.5 py-1.5 text-xs text-on-surface-variant"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : null}
      </article>
    </>
  );
};

export default PostArticlePanel;
