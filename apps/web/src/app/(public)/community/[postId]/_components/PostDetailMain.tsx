"use client";

import { Suspense, useState } from "react";

import PostDetailLoadingBody from "./post-detail-shell/PostDetailLoadingBody";
import PostDetailPreparedBody from "./post-detail-shell/PostDetailPreparedBody";
import PostDetailTopBar from "./PostDetailTopBar";
import PostViewRecorder from "./PostViewRecorder";

interface IProps {
  postId: string;
}

const PostDetailMain = ({ postId }: IProps) => {
  const [replyParentId, setReplyParentId] = useState<string | null>(null);

  return (
    <div className="text-on-background min-h-screen bg-background pb-40">
      <PostViewRecorder postId={postId} />
      <PostDetailTopBar />
      <Suspense fallback={<PostDetailLoadingBody />}>
        <PostDetailPreparedBody
          postId={postId}
          replyParentId={replyParentId}
          setReplyParentId={setReplyParentId}
        />
      </Suspense>
    </div>
  );
};

export default PostDetailMain;
