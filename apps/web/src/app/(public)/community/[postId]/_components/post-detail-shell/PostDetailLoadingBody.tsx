import PostArticleSkeleton from "../../_source/components/skeleton/PostArticleSkeleton";

const PostDetailLoadingBody = () => {
  return (
    <div className="mx-auto max-w-3xl pt-20">
      <PostArticleSkeleton />
    </div>
  );
};

export default PostDetailLoadingBody;
