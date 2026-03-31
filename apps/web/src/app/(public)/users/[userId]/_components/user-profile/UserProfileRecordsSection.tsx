"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Mountain } from "lucide-react";
import Link from "next/link";

import { difficultyToKoreanMap, type Difficulty } from "@clog/utils";

import { fetchClient } from "#web/apis/openapi";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

interface IProps {
  userId: string;
  selectedYmd: string | null;
}

const UserProfileRecordsSection = ({ userId, selectedYmd }: IProps) => {
  const recordsQuery = useInfiniteQuery({
    queryKey: [
      "get",
      "/api/v1/users/{userId}/public-records",
      { userId, day: selectedYmd ?? "all" },
    ],
    queryFn: async ({ pageParam }) => {
      const { data } = await fetchClient.GET(
        "/api/v1/users/{userId}/public-records",
        {
          params: {
            path: { userId },
            query: {
              cursor: pageParam,
              limit: 24,
              ...(selectedYmd ? { day: selectedYmd } : {}),
            },
          },
        },
      );
      return data!.payload;
    },
    getNextPageParam: (last) => last.nextCursor,
    initialPageParam: undefined as string | undefined,
  });

  const records = recordsQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const showEmpty =
    records.length === 0 &&
    !recordsQuery.isPending &&
    !recordsQuery.isFetching;

  return (
    <section className="mt-6">
      <InfiniteScroll
        onLoadMore={() => recordsQuery.fetchNextPage()}
        hasMore={!!recordsQuery.hasNextPage}
        isLoading={recordsQuery.isFetchingNextPage}
      >
        <div className="grid grid-cols-3 gap-0.5">
          {records.map((rec) => {
            const thumb = rec.imageUrls[0];
            const topRoute = rec.routes[0];
            return (
              <Link
                key={rec.id}
                href={ROUTES.RECORDS.DETAIL.path(rec.id)}
                className="relative aspect-square overflow-hidden bg-surface-container-highest"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt=""
                    className="size-full object-cover transition-opacity hover:opacity-95"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Mountain
                      className="size-8 text-on-surface-variant"
                      strokeWidth={1.5}
                    />
                  </div>
                )}
                {topRoute ? (
                  <div
                    className={cn(
                      "absolute top-1 left-1 rounded-lg px-1.5 py-0.5 text-xs font-bold",
                      "bg-tertiary text-on-tertiary",
                    )}
                  >
                    {difficultyToKoreanMap[topRoute.difficulty as Difficulty]}
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </InfiniteScroll>

      {showEmpty ? (
        <p className="px-6 py-8 text-center text-sm text-on-surface-variant">
          {selectedYmd
            ? "이 날짜에 공개된 기록이 없습니다."
            : "공개된 기록이 없습니다."}
        </p>
      ) : null}
    </section>
  );
};

export default UserProfileRecordsSection;
