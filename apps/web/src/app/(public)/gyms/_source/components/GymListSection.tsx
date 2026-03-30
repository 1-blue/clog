"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";

import type { Region } from "@clog/utils";

import { fetchClient } from "#web/apis/openapi";
import GymCard from "#web/components/gym/GymCard";
import EmptyState from "#web/components/shared/EmptyState";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";

import GymListSkeleton from "./skeleton/GymListSkeleton";

interface IProps {
  search: string;
  region: Region | "";
}

const GymListSection: React.FC<IProps> = ({ search, region }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["get", "/api/v1/gyms", { search, region }],
      queryFn: async ({ pageParam }) => {
        const { data } = await fetchClient.GET("/api/v1/gyms", {
          params: {
            query: {
              cursor: pageParam,
              limit: 20,
              search: search || undefined,
              region: region || undefined,
            },
          },
        });
        return data!.payload;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined as string | undefined,
    });

  const gyms = data?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) {
    return <GymListSkeleton />;
  }

  if (gyms.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="검색 결과가 없습니다"
        description="다른 검색어나 지역을 선택해보세요"
      />
    );
  }

  return (
    <InfiniteScroll
      onLoadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      isLoading={isFetchingNextPage}
    >
      <div className="space-y-2 pt-2">
        {gyms.map((gym) => (
          <GymCard
            key={gym.id}
            id={gym.id}
            name={gym.name}
            address={gym.address}
            visitorCount={gym.visitorCount}
            avgRating={gym.avgRating}
            reviewCount={gym.reviewCount}
            imageUrl={gym.images?.[0]?.url}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default GymListSection;
