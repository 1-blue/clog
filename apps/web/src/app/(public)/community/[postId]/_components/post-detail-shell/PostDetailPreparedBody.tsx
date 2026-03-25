"use client";

import { openapi } from "#web/apis/openapi";

import PostDetailLoadedBody from "./PostDetailLoadedBody";

interface IProps {
  postId: string;
  replyParentId: string | null;
  setReplyParentId: (id: string | null) => void;
}

const PostDetailPreparedBody = ({
  postId,
  replyParentId,
  setReplyParentId,
}: IProps) => {
  const { data: post } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/posts/{postId}",
    { params: { path: { postId } } },
    { select: (d) => d.payload },
  );

  return (
    <PostDetailLoadedBody
      post={post}
      postId={postId}
      replyParentId={replyParentId}
      setReplyParentId={setReplyParentId}
    />
  );
};

export default PostDetailPreparedBody;
