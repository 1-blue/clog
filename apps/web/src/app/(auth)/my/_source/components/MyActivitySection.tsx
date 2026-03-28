"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Bookmark, Heart, LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { LucideIcon } from "lucide-react";

import { fetchClient } from "#web/apis/openapi";
import { cn } from "#web/libs/utils";
import { ROUTES } from "#web/constants";

import PostsPanel from "./PostsPanel";
import RecordsPanel from "./RecordsPanel";

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

  const recordsQuery = useInfiniteQuery({
    queryKey: ["get", "/api/v1/records"],
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.GET("/api/v1/records", {
        params: { query: { cursor: pageParam, limit: 20 } },
      });
      return data!.payload;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: tab === "records",
  });

  const savedQuery = useInfiniteQuery({
    queryKey: ["get", "/api/v1/users/me/bookmarked-posts"],
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.GET(
        "/api/v1/users/me/bookmarked-posts",
        {
          params: { query: { cursor: pageParam, limit: 20 } },
        },
      );
      return data!.payload;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: tab === "saved",
  });

  const likedQuery = useInfiniteQuery({
    queryKey: ["get", "/api/v1/users/me/liked-posts"],
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.GET("/api/v1/users/me/liked-posts", {
        params: { query: { cursor: pageParam, limit: 20 } },
      });
      return data!.payload;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    enabled: tab === "liked",
  });

  const records = recordsQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const savedPosts = savedQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const likedPosts = likedQuery.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <>
      <section className="mt-12 px-6">
        <div className="mb-6 flex items-center justify-around border-b border-outline-variant/20">
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

        {tab === "records" && (
          <RecordsPanel
            records={records}
            isLoading={recordsQuery.isLoading}
            fetchNextPage={recordsQuery.fetchNextPage}
            hasNextPage={recordsQuery.hasNextPage}
            isFetchingNextPage={recordsQuery.isFetchingNextPage}
          />
        )}

        {tab === "saved" && (
          <PostsPanel
            posts={savedPosts}
            isLoading={savedQuery.isLoading}
            fetchNextPage={savedQuery.fetchNextPage}
            hasNextPage={savedQuery.hasNextPage}
            isFetchingNextPage={savedQuery.isFetchingNextPage}
            emptyIcon={Bookmark}
            emptyTitle="저장한 글이 없습니다"
            emptyDescription="마음에 드는 글을 북마크해 보세요."
            forceBookmarked
          />
        )}

        {tab === "liked" && (
          <PostsPanel
            posts={likedPosts}
            isLoading={likedQuery.isLoading}
            fetchNextPage={likedQuery.fetchNextPage}
            hasNextPage={likedQuery.hasNextPage}
            isFetchingNextPage={likedQuery.isFetchingNextPage}
            emptyIcon={Heart}
            emptyTitle="좋아요한 글이 없습니다"
            emptyDescription="커뮤니티에서 공감 가는 글에 하트를 눌러 보세요."
            forceLiked
          />
        )}
      </section>

      <Link
        href={ROUTES.RECORDS.NEW.path}
        className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        <Plus className="size-6" strokeWidth={2} />
      </Link>
    </>
  );
};

export default MyActivitySection;
