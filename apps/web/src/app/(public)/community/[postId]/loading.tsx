import PostDetailLoadingBody from "./_components/post-detail-shell/PostDetailLoadingBody";
import PostDetailTopBar from "./_components/PostDetailTopBar";

const PostDetailLoading = () => {
  return (
    <div className="min-h-screen bg-background pb-40 text-on-background">
      <PostDetailTopBar />
      <PostDetailLoadingBody />
    </div>
  );
};

export default PostDetailLoading;
