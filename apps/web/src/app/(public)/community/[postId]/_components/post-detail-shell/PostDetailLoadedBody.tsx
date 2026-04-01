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

const PostDetailLoadedBody: React.FC<IProps> = ({
  post,
  postId,
  replyParentId,
  setReplyParentId,
}) => {
  return (
    <>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <PostArticlePanel post={post} />

        <hr className="border-outline-variant" />

        <section id="community-post-comments" className="flex flex-col gap-4">
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
