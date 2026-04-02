"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import type { components } from "#web/@types/openapi";
import usePostDetailMutations from "#web/hooks/mutations/posts/usePostDetailMutations";
import useMe from "#web/hooks/useMe";
import { cn } from "#web/libs/utils";

import PostDockUserAvatar from "./PostDockUserAvatar";

type PostDetailPayload = components["schemas"]["PostDetail"];

interface IProps {
  post: PostDetailPayload;
  postId: string;
  replyParentId: string | null;
  onClearReply: () => void;
}

const PostDetailDock = ({
  post,
  postId,
  replyParentId,
  onClearReply,
}: IProps) => {
  const queryClient = useQueryClient();
  const { toggleLikeMutation, toggleBookmarkMutation, createCommentMutation } =
    usePostDetailMutations();

  const [draft, setDraft] = useState("");
  const submitLockRef = useRef(false);

  const liked = (post.likes?.length ?? 0) > 0;
  const bookmarked = (post.bookmarks?.length ?? 0) > 0;

  const replyNickname = useMemo(() => {
    if (!replyParentId) return undefined;
    const key = ["get", "/api/v1/posts/{postId}/comments", { postId }] as const;
    const data = queryClient.getQueryData<{
      pages: { items: { id: string; author: { nickname: string } }[] }[];
    }>(key);
    const flat = data?.pages.flatMap((p) => p.items) ?? [];
    return flat.find((c) => c.id === replyParentId)?.author.nickname;
  }, [postId, queryClient, replyParentId]);

  const scrollToComments = () => {
    document
      .getElementById("community-post-comments")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitComment = () => {
    const content = draft.trim();
    if (!content || createCommentMutation.isPending || submitLockRef.current) {
      return;
    }
    submitLockRef.current = true;
    createCommentMutation.mutate(
      {
        params: { path: { postId } },
        body: {
          content,
          ...(replyParentId ? { parentId: replyParentId } : {}),
        },
      },
      {
        onSuccess: () => {
          setDraft("");
          onClearReply();
        },
        onSettled: () => {
          submitLockRef.current = false;
        },
      },
    );
  };

  const onCommentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (e.repeat) return;
    if (e.nativeEvent.isComposing) return;
    e.preventDefault();
    submitComment();
  };

  const { me } = useMe();
  const isLoggedIn = Boolean(me);

  return (
    <footer className="fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 bg-background/95 px-2.5 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                toggleLikeMutation.mutate({ params: { path: { postId } } })
              }
              className={cn(
                "flex items-center gap-2 transition-transform active:scale-95",
                liked
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-primary",
              )}
            >
              <Heart
                className={cn("size-5", liked && "fill-primary")}
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-xs font-bold">
                {post.likeCount.toLocaleString("ko-KR")}
              </span>
            </button>
            <button
              type="button"
              onClick={scrollToComments}
              className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary active:scale-95"
            >
              <MessageCircle className="size-5" strokeWidth={2} aria-hidden />
              <span className="text-xs font-bold">
                {post.commentCount.toLocaleString("ko-KR")}
              </span>
            </button>
            <button
              type="button"
              onClick={() =>
                toggleBookmarkMutation.mutate({ params: { path: { postId } } })
              }
              className={cn(
                "flex items-center gap-2 transition-transform active:scale-95",
                bookmarked
                  ? "text-secondary"
                  : "text-on-surface-variant hover:text-primary",
              )}
            >
              <Bookmark
                className={cn("size-5", bookmarked && "fill-secondary")}
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-xs font-bold">저장</span>
            </button>
          </div>
        </div>

        {replyNickname ? (
          <div className="flex items-center justify-between gap-2 text-xs text-primary">
            <span className="truncate">{replyNickname}님에게 답글 작성 중</span>
            <button
              type="button"
              onClick={onClearReply}
              className="shrink-0 font-medium text-on-surface-variant hover:text-on-surface"
            >
              취소
            </button>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <PostDockUserAvatar />
          <div className="relative flex-1">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onCommentKeyDown}
              placeholder={
                isLoggedIn
                  ? replyParentId
                    ? "답글을 입력하세요"
                    : "댓글을 입력하세요..."
                  : "로그인 후 이용할 수 있습니다."
              }
              className="w-full rounded-full border-none bg-surface-container-low py-2.5 pr-12 pl-5 text-sm text-on-surface shadow-inner placeholder:text-outline focus:ring-1 focus:ring-primary focus:outline-none"
              disabled={!isLoggedIn || createCommentMutation.isPending}
            />
            <button
              type="button"
              onClick={() => submitComment()}
              disabled={!draft.trim() || createCommentMutation.isPending}
              className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-on-primary-container shadow-lg hover:opacity-90 active:scale-90 disabled:opacity-50"
              aria-label="보내기"
            >
              <Send className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </div>
      {/* Safe area 하단 여백 */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  );
};

export default PostDetailDock;
