"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { User } from "lucide-react";
import Link from "next/link";

import type { components } from "#web/@types/openapi";
import { ROUTES } from "#web/constants";

type CommentListItem = components["schemas"]["CommentListItem"];

interface IProps {
  comment: CommentListItem;
  postAuthorId: string;
  onReply?: (commentId: string) => void;
}

const PostCommentBlock = ({
  comment,
  postAuthorId,
  onReply,
}: IProps) => {
  return (
    <div className="flex gap-4">
      <Link
        href={ROUTES.USERS.PROFILE.path(comment.author.id)}
        className="size-10 shrink-0 overflow-hidden rounded-full bg-surface-container-highest ring-1 ring-white/5"
      >
        {comment.author.profileImage ? (
          <img
            src={comment.author.profileImage}
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
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={ROUTES.USERS.PROFILE.path(comment.author.id)}
            className={`truncate text-sm font-bold hover:underline ${
              comment.authorId === postAuthorId
                ? "text-primary"
                : "text-on-surface"
            }`}
          >
            {comment.author.nickname}
          </Link>
          <span className="shrink-0 text-xs text-on-surface-variant">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
        <p className="text-sm leading-relaxed break-keep text-on-surface-variant">
          {comment.content}
        </p>
        {onReply ? (
          <button
            type="button"
            onClick={() => onReply(comment.id)}
            className="text-xs font-bold text-on-surface-variant hover:text-primary"
          >
            답글
          </button>
        ) : null}

        {comment.replies?.map((reply) => (
          <div
            key={reply.id}
            className="flex gap-3 border-l-2 border-primary/20 pl-4"
          >
            <Link
              href={ROUTES.USERS.PROFILE.path(reply.author.id)}
              className="size-8 shrink-0 overflow-hidden rounded-full bg-surface-container-highest ring-1 ring-white/5"
            >
              {reply.author.profileImage ? (
                <img
                  src={reply.author.profileImage}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <User
                    className="size-4 text-on-surface-variant"
                    strokeWidth={2}
                    aria-hidden
                  />
                </div>
              )}
            </Link>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={ROUTES.USERS.PROFILE.path(reply.author.id)}
                  className={`truncate text-xs font-bold hover:underline ${
                    reply.authorId === postAuthorId
                      ? "text-primary"
                      : "text-on-surface"
                  }`}
                >
                  {reply.author.nickname}
                </Link>
                <span className="shrink-0 text-xs text-on-surface-variant">
                  {formatDistanceToNow(new Date(reply.createdAt), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed break-keep whitespace-pre text-on-surface-variant">
                {reply.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCommentBlock;
