"use client";

import { Mountain } from "lucide-react";
import Link from "next/link";

import EmptyState from "#web/components/shared/EmptyState";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import { ROUTES } from "#web/constants";

interface IProps {
  records: Array<{
    id: string;
    date: string;
    gym: { name: string };
    routes: Array<{ difficulty: string; result: string }>;
    imageUrls: string[];
  }>;
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const RecordsPanel: React.FC<IProps> = ({
  records,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-surface-container-low"
          />
        ))}
      </div>
    );
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
      <div className="grid grid-cols-2 gap-3">
        {records.map((record) => (
          <Link
            key={record.id}
            href={ROUTES.RECORDS.DETAIL.path(record.id)}
            className="block overflow-hidden rounded-2xl bg-surface-container-low ring-1 ring-outline-variant/10 transition-transform active:scale-95"
          >
            <div className="relative aspect-square bg-surface-container-high">
              {record.imageUrls[0] ? (
                <img
                  src={record.imageUrls[0]}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Mountain className="size-10 text-on-surface-variant" />
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="truncate text-xs font-medium text-on-surface-variant">
                {record.gym.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default RecordsPanel;
