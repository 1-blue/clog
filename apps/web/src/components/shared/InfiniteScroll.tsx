"use client";

import React, { useCallback, useEffect, useRef } from "react";

interface IProps {
  /** 다음 페이지 로드 함수 */
  onLoadMore: () => void;
  /** 더 불러올 데이터 유무 */
  hasMore: boolean;
  /** 로딩 중 여부 */
  isLoading: boolean;
}

const InfiniteScroll: React.FC<React.PropsWithChildren<IProps>> = ({
  onLoadMore,
  hasMore,
  isLoading,
  children,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "200px",
    });
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <>
      {children}
      <div ref={sentinelRef} className="h-1" />
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
