"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import Link from "next/link";

import { fetchClient } from "#web/apis/openapi";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "#web/components/ui/sheet";
import { ROUTES } from "#web/constants";

interface IProps {
  type: "followers" | "following" | null;
  onClose: () => void;
}

const FollowListSheet: React.FC<IProps> = ({ type, onClose }) => {
  const followersQuery = useInfiniteQuery({
    queryKey: ["get", "/api/v1/users/me/followers"],
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.GET("/api/v1/users/me/followers", {
        params: { query: { cursor: pageParam, limit: 20 } },
      });
      return data!.payload;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: type === "followers",
  });

  const followingQuery = useInfiniteQuery({
    queryKey: ["get", "/api/v1/users/me/following"],
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.GET("/api/v1/users/me/following", {
        params: { query: { cursor: pageParam, limit: 20 } },
      });
      return data!.payload;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: type === "following",
  });

  const query = type === "followers" ? followersQuery : followingQuery;
  const users = query.data?.pages.flatMap((p) => p.items) ?? [];
  const title = type === "followers" ? "팔로워" : "팔로잉";

  return (
    <Sheet open={type !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[80dvh] overflow-y-auto rounded-t-3xl border-t border-outline-variant bg-surface-container"
        showCloseButton
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-on-surface">{title}</SheetTitle>
        </SheetHeader>
        <div className="pb-6">
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-2xl bg-surface-container-low"
                />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="py-10 text-center text-sm text-on-surface-variant">
              {type === "followers"
                ? "아직 팔로워가 없습니다."
                : "아직 팔로잉하는 사람이 없습니다."}
            </p>
          ) : (
            <InfiniteScroll
              onLoadMore={query.fetchNextPage}
              hasMore={!!query.hasNextPage}
              isLoading={query.isFetchingNextPage}
            >
              <div className="space-y-2">
                {users.map((user) => (
                  <Link
                    key={user.id}
                    href={ROUTES.USERS.PROFILE.path(user.id)}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-4 py-3 transition-colors hover:bg-surface-container"
                  >
                    <div className="size-10 shrink-0 overflow-hidden rounded-full bg-surface-container-highest">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <User
                            className="size-5 text-on-surface-variant"
                            aria-hidden
                          />
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-on-surface">
                      {user.nickname}
                    </span>
                  </Link>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FollowListSheet;
