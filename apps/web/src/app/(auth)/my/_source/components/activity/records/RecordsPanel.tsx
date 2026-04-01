"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Mountain } from "lucide-react";
import Link from "next/link";

import { fetchClient } from "#web/apis/openapi";
import EmptyState from "#web/components/shared/EmptyState";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import { ROUTES } from "#web/constants";

import RecordGridCard from "./RecordGridCard";
import RecordsPanelSkeleton from "./RecordsPanelSkeleton";

const RecordsPanel = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["get", "/api/v1/records"],
      queryFn: async ({ pageParam }) => {
        const { data: res } = await fetchClient.GET("/api/v1/records", {
          params: { query: { cursor: pageParam, limit: 20 } },
        });
        return res!.payload;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined as string | undefined,
    });

  const records = data?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) {
    return <RecordsPanelSkeleton />;
  }

  if (records.length === 0) {
    return (
      <EmptyState
        icon={Mountain}
        title="아직 기록이 없습니다"
        description="오늘의 클라이밍을 기록해 보세요!"
        action={
          <Link
            href={ROUTES.RECORDS.NEW.path}
            className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            기록 추가
          </Link>
        }
      />
    );
  }

  return (
    <InfiniteScroll
      onLoadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      isLoading={isFetchingNextPage}
    >
      <div className="grid grid-cols-1 gap-3">
        {records.map((record) => (
          <RecordGridCard key={record.id} record={record} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default RecordsPanel;
