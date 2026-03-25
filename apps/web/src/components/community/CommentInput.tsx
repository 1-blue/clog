"use client";

import { Send } from "lucide-react";
import React, { useState } from "react";

interface IProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  /** 답글 대상이 있을 때 상단 안내 */
  replyBanner?: string;
  onCancelReply?: () => void;
}

const CommentInput: React.FC<IProps> = ({
  onSubmit,
  placeholder = "댓글을 입력하세요",
  isLoading = false,
  replyBanner,
  onCancelReply,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!content.trim() || isLoading) return;
    onSubmit(content.trim());
    setContent("");
  };

  return (
    <div className="border-t border-outline-variant bg-surface-container">
      {replyBanner && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 text-xs text-primary">
          <span className="truncate">{replyBanner}</span>
          {onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              className="shrink-0 font-medium text-on-surface-variant hover:text-on-surface"
            >
              취소
            </button>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 px-4 py-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={placeholder}
          className="flex-1 rounded-full bg-surface-container-high px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
};
export default CommentInput;
