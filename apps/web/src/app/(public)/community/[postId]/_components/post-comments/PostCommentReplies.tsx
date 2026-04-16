"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

import type { components } from "#web/@types/openapi";
import { Button } from "#web/components/ui/button";
import { Textarea } from "#web/components/ui/textarea";
import { ROUTES } from "#web/constants";
import usePostDetailMutations from "#web/hooks/mutations/posts/usePostDetailMutations";

import CommentOwnerMenu from "./CommentOwnerMenu";

type CommentWithAuthor = components["schemas"]["CommentWithAuthor"];

interface IReplyRowProps {
  postId: string;
  reply: CommentWithAuthor;
  postAuthorId: string;
}

const ReplyRow: React.FC<IReplyRowProps> = ({
  postId,
  reply,
  postAuthorId,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(reply.content);
  const { updateCommentMutation } = usePostDetailMutations();

  useEffect(() => {
    if (!editing) {
      setDraft(reply.content);
    }
  }, [reply.content, editing]);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) return;
    updateCommentMutation.mutate(
      {
        params: { path: { postId, commentId: reply.id } },
        body: { content: trimmed },
      },
      { onSuccess: () => setEditing(false) },
    );
  };

  const handleCancel = () => {
    setDraft(reply.content);
    setEditing(false);
  };

  return (
    <div className="flex gap-3">
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
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={ROUTES.USERS.PROFILE.path(reply.author.id)}
            className={`min-w-0 truncate text-xs font-bold hover:underline ${
              reply.authorId === postAuthorId
                ? "text-primary"
                : "text-on-surface"
            }`}
          >
            {reply.author.nickname}
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <span className="text-xs text-on-surface-variant">
              {formatDistanceToNow(new Date(reply.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
            <CommentOwnerMenu
              postId={postId}
              commentId={reply.id}
              authorId={reply.authorId}
              onEdit={() => {
                setDraft(reply.content);
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
              rows={3}
              maxLength={1000}
              className="min-h-0 resize-none rounded-xl bg-surface-container-high px-3 py-2 text-sm text-on-surface"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={
                  updateCommentMutation.isPending ||
                  draft.trim().length === 0 ||
                  draft.trim() === reply.content
                }
              >
                저장
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={updateCommentMutation.isPending}
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed break-keep whitespace-pre text-on-surface-variant">
            {reply.content}
          </p>
        )}
      </div>
    </div>
  );
};

interface IProps {
  postId: string;
  replies: CommentWithAuthor[];
  postAuthorId: string;
}

const PostCommentReplies: React.FC<IProps> = ({
  postId,
  replies,
  postAuthorId,
}) => {
  return (
    <div className="flex flex-col gap-4 border-l-2 border-primary/20 pl-4">
      {replies.map((reply) => (
        <ReplyRow
          key={reply.id}
          postId={postId}
          reply={reply}
          postAuthorId={postAuthorId}
        />
      ))}
    </div>
  );
};

export default PostCommentReplies;
