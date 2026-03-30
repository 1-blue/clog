"use client";

import { useState } from "react";

import type { CommunityCategory } from "@clog/utils";

import AppTopBar from "#web/components/layout/AppTopBar";

import CategoryTabs from "./community-category/CategoryTabs";
import CommunityWriteFab from "./community-fab/CommunityWriteFab";
import CommunityGuestNotice from "./community-notice/CommunityGuestNotice";
import PostListSection from "./community-post-list/PostListSection";

const CommunityMain = () => {
  const [category, setCategory] = useState<CommunityCategory | "">("");

  return (
    <>
      <AppTopBar
        left={
          <span className="text-lg font-bold text-on-surface">커뮤니티</span>
        }
      />
      <div className="text-on-background min-h-screen bg-background pb-24">
        <main className="mx-auto max-w-2xl px-4 pt-3">
          <CommunityGuestNotice />
          <CategoryTabs category={category} setCategory={setCategory} />
          <div className="mt-4">
            <PostListSection category={category} />
          </div>
        </main>
      </div>
      <CommunityWriteFab />
    </>
  );
};

export default CommunityMain;
