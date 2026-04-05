import CommunityPostCardSkeleton from "#web/app/(public)/community/_components/community-post-list/CommunityPostCardSkeleton";

const BookmarkedPostsPanelSkeleton = () => (
  <div className="space-y-5">
    <CommunityPostCardSkeleton withImage withTags />
    <CommunityPostCardSkeleton withImage={false} />
    <CommunityPostCardSkeleton withImage />
    <CommunityPostCardSkeleton withImage={false} withTags />
  </div>
);

export default BookmarkedPostsPanelSkeleton;
