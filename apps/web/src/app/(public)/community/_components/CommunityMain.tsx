"use client";

import { useState } from "react";

import type { CommunityCategory } from "@clog/utils";

import CategoryTabs from "./community-category/CategoryTabs";
import CommunityWriteFab from "./community-fab/CommunityWriteFab";
import CommunityGuestNotice from "./community-notice/CommunityGuestNotice";
import PostListSection from "./community-post-list/PostListSection";

const CommunityMain = () => {
  const [category, setCategory] = useState<CommunityCategory | "">("");

  return (
    <div className="text-on-background min-h-screen bg-background pb-24">
      <main className="mx-auto max-w-2xl px-6 pt-6">
        <h1 className="mb-4 text-3xl leading-tight font-semibold tracking-tight text-primary">
          커뮤니티
        </h1>

        <CommunityGuestNotice />

        <CategoryTabs category={category} setCategory={setCategory} />

        <div className="mt-6">
          <PostListSection category={category} />
        </div>
      </main>

      <CommunityWriteFab />
    </div>
  );
};

export default CommunityMain;
