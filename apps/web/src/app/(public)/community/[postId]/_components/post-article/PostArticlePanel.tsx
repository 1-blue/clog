"use client";

import type { components } from "#web/@types/openapi";
import useMe from "#web/hooks/useMe";
import { cn } from "#web/libs/utils";

import PostArticleAuthorRow from "./PostArticleAuthorRow";
import PostArticleBody from "./PostArticleBody";
import PostArticleMedia from "./PostArticleMedia";
import PostArticleTitleBlock from "./PostArticleTitleBlock";

type PostDetailPayload = components["schemas"]["PostDetail"];

interface IProps {
  post: PostDetailPayload;
}

const PostArticlePanel: React.FC<IProps> = ({ post }) => {
  const { me } = useMe();
  const isOwner = Boolean(me?.id && me.id === post.authorId);
  const hasHeroImage = post.imageUrls.length > 0;

  return (
    <div className={cn("flex flex-col gap-6", !hasHeroImage && "pt-20")}>
      <PostArticleMedia imageUrls={post.imageUrls} />
      <PostArticleTitleBlock
        postId={post.id}
        category={post.category}
        title={post.title}
        isOwner={isOwner}
      />
      <PostArticleAuthorRow
        author={post.author}
        createdAt={post.createdAt}
        viewCount={post.viewCount}
      />
      <PostArticleBody content={post.content} tags={post.tags} />
    </div>
  );
};

export default PostArticlePanel;
