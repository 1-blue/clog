"use client";

import { Bookmark, Heart, LayoutGrid, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "#web/libs/utils";

import BookmarkedPostsPanel from "./posts/BookmarkedPostsPanel";
import LikedPostsPanel from "./posts/LikedPostsPanel";
import RecordsPanel from "./records/RecordsPanel";

type TTabId = "records" | "saved" | "liked";

const TABS: {
  id: TTabId;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "records", label: "내 기록", icon: LayoutGrid },
  { id: "saved", label: "저장됨", icon: Bookmark },
  { id: "liked", label: "좋아요", icon: Heart },
];

const MyActivitySection = () => {
  const [tab, setTab] = useState<TTabId>("records");

  return (
    <section className="mt-6">
      <div className="mb-4 flex items-center justify-around border-b border-outline-variant/20">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 pb-3 transition-colors",
                isActive
                  ? "border-b-2 border-primary font-bold text-primary"
                  : "border-b-2 border-transparent font-medium text-outline hover:text-on-surface",
              )}
            >
              <Icon
                className="size-5"
                strokeWidth={isActive ? 2.5 : 1.75}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="text-xs">{t.label}</span>
            </button>
          );
        })}
      </div>

      {tab === "records" && <RecordsPanel />}
      {tab === "saved" && <BookmarkedPostsPanel />}
      {tab === "liked" && <LikedPostsPanel />}
    </section>
  );
};

export default MyActivitySection;
