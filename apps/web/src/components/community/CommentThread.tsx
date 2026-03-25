"use client";

import React from "react";

import CommentItem, { type ICommentData } from "./CommentItem";

interface IProps {
  comment: ICommentData;
  onReply?: (commentId: string) => void;
}

const CommentThread: React.FC<IProps> = ({ comment, onReply }) => {
  return (
    <div className="py-3">
      <CommentItem comment={comment} onReply={onReply} />
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );
};
export default CommentThread;
