"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import type { components } from "#web/@types/openapi";
import { Badge } from "#web/components/ui/badge";
import { Button } from "#web/components/ui/button";
import { Textarea } from "#web/components/ui/textarea";
import { ROUTES } from "#web/constants";
import usePostDetailMutations from "#web/hooks/mutations/posts/usePostDetailMutations";
import { cn } from "#web/libs/utils";

import CommentOwnerMenu from "./CommentOwnerMenu";
import PostCommentReplies from "./PostCommentReplies";

type CommentListItem = components["schemas"]["CommentListItem"];

interface IProps {
  postId: string;
  comment: CommentListItem;
  postAuthorId: string;
  onReply?: (commentId: string) => void;
}

const PostCommentBlock: React.FC<IProps> = ({
  postId,
  comment,
  postAuthorId,
  onReply,
}) => {
  const replyCount = comment.replies?.length ?? 0;
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const { updateCommentMutation } = usePostDetailMutations();

  const handleSaveEdit = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) return;
    updateCommentMutation.mutate(
      {
        params: { path: { postId, commentId: comment.id } },
        body: { content: trimmed },
      },
      {
        onSuccess: () => {
          setEditing(false);
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setDraft(comment.content);
    setEditing(false);
  };

  const isOwner = comment.authorId === postAuthorId;

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
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.USERS.PROFILE.path(comment.author.id)}
                className={cn(
                  "min-w-0 truncate text-sm font-bold hover:underline",
                  isOwner ? "text-primary" : "text-on-surface",
                )}
              >
                {comment.author.nickname}
              </Link>
              {isOwner && <Badge color="primary">작성자</Badge>}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="text-xs text-on-surface-variant">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
              </span>
              <CommentOwnerMenu
                postId={postId}
                commentId={comment.id}
                authorId={comment.authorId}
                onEdit={() => {
                  setDraft(comment.content);
                  setEditing(true);
                }}
              />
            </div>
          </div>
          {editing ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={4}
                maxLength={1000}
                className="min-h-0 resize-none rounded-xl bg-surface-container-high px-3 py-2 text-sm text-on-surface"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={
                    updateCommentMutation.isPending ||
                    draft.trim().length === 0 ||
                    draft.trim() === comment.content
                  }
                >
                  저장
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={updateCommentMutation.isPending}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed break-keep text-on-surface-variant">
              {comment.content}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onReply ? (
            <button
              type="button"
              onClick={() => onReply(comment.id)}
              className="text-xs font-bold text-on-surface-variant hover:text-primary"
            >
              답글
            </button>
          ) : null}
          {replyCount > 0 ? (
            <button
              type="button"
              onClick={() => setRepliesOpen((v) => !v)}
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary"
              aria-expanded={repliesOpen}
            >
              {repliesOpen ? (
                <ChevronDown className="size-3.5 shrink-0" aria-hidden />
              ) : (
                <ChevronRight className="size-3.5 shrink-0" aria-hidden />
              )}
              답글 {replyCount}개 {repliesOpen ? "접기" : "펼치기"}
            </button>
          ) : null}
        </div>

        {repliesOpen && replyCount > 0 ? (
          <PostCommentReplies
            postId={postId}
            replies={comment.replies}
            postAuthorId={postAuthorId}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PostCommentBlock;
