"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { User } from "lucide-react";
import Link from "next/link";
import React from "react";

import { ROUTES } from "#web/constants";

export interface ICommentData {
  id: string;
  content: string;
  createdAt: string | Date;
  author: {
    id: string;
    nickname: string;
    profileImage: string | null;
  };
  replies?: ICommentData[];
}

interface IProps {
  comment: ICommentData;
  isReply?: boolean;
  onReply?: (commentId: string) => void;
}

const CommentItem: React.FC<IProps> = ({
  comment,
  isReply = false,
  onReply,
}) => {
  return (
    <div className={isReply ? "mt-2 ml-8" : ""}>
      <div className="flex gap-2.5">
        <Link
          href={ROUTES.USERS.PROFILE.path(comment.author.id)}
          className="size-8 shrink-0 overflow-hidden rounded-full bg-surface-container-high ring-offset-background hover:ring-2 hover:ring-primary/40"
        >
          {comment.author.profileImage ? (
            <img
              src={comment.author.profileImage}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <User className="size-4 text-on-surface-variant" />
            </div>
          )}
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.USERS.PROFILE.path(comment.author.id)}
              className="text-sm font-medium text-on-surface hover:text-primary hover:underline"
            >
              {comment.author.nickname}
            </Link>
            <span className="text-xs text-on-surface-variant">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-on-surface">{comment.content}</p>
          {!isReply && onReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="mt-1 text-xs text-on-surface-variant hover:text-primary"
            >
              답글
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommentItem;
