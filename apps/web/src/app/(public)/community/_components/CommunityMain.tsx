"use client";

import AppTopBar from "#web/components/layout/AppTopBar";

import CommunityCategoryFilterChips from "./community-category-filter-chips/CommunityCategoryFilterChips";
import CommunityWriteFab from "./community-fab/CommunityWriteFab";
import CommunityGuestNotice from "./community-notice/CommunityGuestNotice";
import PostListSection from "./community-post-list/PostListSection";

const CommunityMain = () => {
  return (
    <>
      <AppTopBar
        left={
          <span className="text-lg font-bold text-on-surface">커뮤니티</span>
        }
      />
      <div className="text-on-background mx-auto flex min-h-screen flex-col gap-4 bg-background pt-3 pb-24">
        <div className="flex flex-col gap-3">
          <CommunityGuestNotice />
          <CommunityCategoryFilterChips />
        </div>

        <PostListSection />
      </div>

      <CommunityWriteFab />
    </>
  );
};

export default CommunityMain;
