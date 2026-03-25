import PostDetailLoadingBody from "./_components/post-detail-shell/PostDetailLoadingBody";
import PostDetailTopBar from "./_components/PostDetailTopBar";

const PostDetailLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      <PostDetailTopBar />
      <PostDetailLoadingBody />
    </div>
  );
};

export default PostDetailLoading;
