import CommunityPostCardSkeleton from "./CommunityPostCardSkeleton";

/** `CommunityMain` — 카드 여러 개(썸네일·태그 유무 교차) */
const PostListSkeleton: React.FC = () => {
  return (
    <div className="space-y-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <CommunityPostCardSkeleton
          key={i}
          withImage={i % 2 === 0}
          withTags={i % 3 === 0}
        />
      ))}
    </div>
  );
};

export default PostListSkeleton;
