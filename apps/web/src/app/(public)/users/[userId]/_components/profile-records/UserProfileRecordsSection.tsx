"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Mountain } from "lucide-react";
import Link from "next/link";

import { fetchClient } from "#web/apis/openapi";
import {
  difficultySpreadGradeLabel,
  maxDifficultyGradeLabel,
} from "#web/app/(auth)/records/(created-and-edit)/_source/utils/record-detail-utils";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import { ROUTES } from "#web/constants";

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
    records.length === 0 && !recordsQuery.isPending && !recordsQuery.isFetching;

  return (
    <section className="mt-4">
      <InfiniteScroll
        onLoadMore={() => recordsQuery.fetchNextPage()}
        hasMore={!!recordsQuery.hasNextPage}
        isLoading={recordsQuery.isFetchingNextPage}
      >
        <div className="grid grid-cols-2 gap-2">
          {records.map((rec) => {
            const thumb = rec.imageUrls[0];
            const dateLabel = format(new Date(rec.date), "yyyy.MM.dd", {
              locale: ko,
            });
            const best = maxDifficultyGradeLabel(rec.routes);
            const spread = difficultySpreadGradeLabel(rec.routes);
            const showSpread = rec.routes.length > 1 && spread.includes("~");

            return (
              <Link
                key={rec.id}
                href={ROUTES.RECORDS.DETAIL.path(rec.id)}
                className="relative block overflow-hidden rounded-xl bg-surface-container-highest ring-1 ring-outline-variant/15"
              >
                <div className="relative aspect-square w-full">
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
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-3 py-2">
                    <p className="line-clamp-1 text-[11px] font-semibold text-white drop-shadow">
                      {rec.gym.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/90 drop-shadow">
                      {dateLabel}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-white/95 drop-shadow">
                      {showSpread ? spread : best}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </InfiniteScroll>

      {showEmpty ? (
        <p className="py-8 text-center text-sm text-on-surface-variant">
          {selectedYmd
            ? "이 날짜에 공개된 기록이 없습니다."
            : "공개된 기록이 없습니다."}
        </p>
      ) : null}
    </section>
  );
};

export default UserProfileRecordsSection;
