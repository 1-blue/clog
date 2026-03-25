import PostArticleSkeleton from "../../_source/components/skeleton/PostArticleSkeleton";

const PostDetailLoadingBody = () => {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-20">
      <PostArticleSkeleton />
    </div>
  );
};

export default PostDetailLoadingBody;
