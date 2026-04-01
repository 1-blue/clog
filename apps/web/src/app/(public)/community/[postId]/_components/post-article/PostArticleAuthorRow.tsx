"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Eye, User } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "#web/constants";

interface IProps {
  author: {
    id: string;
    nickname: string;
    profileImage: string | null;
  };
  createdAt: string;
  viewCount: number;
}

const PostArticleAuthorRow: React.FC<IProps> = ({
  author,
  createdAt,
  viewCount,
}) => {
  const timeRel = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href={ROUTES.USERS.PROFILE.path(author.id)}
          className="size-11 shrink-0 overflow-hidden rounded-full bg-surface-container-highest ring-1 ring-white/10"
        >
          {author.profileImage ? (
            <img
              src={author.profileImage}
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
            href={ROUTES.USERS.PROFILE.path(author.id)}
            className="block truncate text-sm font-semibold text-on-surface hover:text-primary"
          >
            {author.nickname}
          </Link>
          <p className="text-xs text-on-surface-variant">{timeRel}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container/50 px-3 py-1.5 text-xs text-on-surface-variant">
        <Eye className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        <span>{viewCount.toLocaleString("ko-KR")}</span>
      </div>
    </div>
  );
};

export default PostArticleAuthorRow;
