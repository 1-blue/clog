"use client";

import type { components } from "#web/@types/openapi";

import PostArticlePanel from "../post-article/PostArticlePanel";
import PostCommentsHeading from "../post-comments/PostCommentsHeading";
import PostCommentsList from "../post-comments/PostCommentsList";
import PostDetailDock from "../post-detail-dock/PostDetailDock";

type PostDetailPayload = components["schemas"]["PostDetail"];

interface IProps {
  post: PostDetailPayload;
  postId: string;
  replyParentId: string | null;
  setReplyParentId: (id: string | null) => void;
}

const PostDetailLoadedBody = ({
  post,
  postId,
  replyParentId,
  setReplyParentId,
}: IProps) => {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pt-20 pb-4">
        <PostArticlePanel post={post} />
        <section id="community-post-comments" className="mt-16 mb-6">
          <PostCommentsHeading commentCount={post.commentCount} />
          <PostCommentsList
            postId={postId}
            postAuthorId={post.authorId}
            onReply={(id) => setReplyParentId(id)}
          />
        </section>
      </div>
      <PostDetailDock
        post={post}
        postId={postId}
        replyParentId={replyParentId}
        onClearReply={() => setReplyParentId(null)}
      />
    </>
  );
};

export default PostDetailLoadedBody;
