"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  BellOff,
  Heart,
  Info,
  type LucideIcon,
  MessageCircle,
  Mountain,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

import { fetchClient } from "#web/apis/openapi";
import TopBar from "#web/components/layout/TopBar";
import EmptyState from "#web/components/shared/EmptyState";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import { Button } from "#web/components/ui/button";
import useNotificationMutations from "#web/hooks/mutations/notifications/useNotificationMutations";
import { cn } from "#web/libs/utils";

/** 알림 타입별 아이콘 매핑 */
const TYPE_ICONS: Record<string, LucideIcon> = {
  COMMENT: MessageCircle,
  LIKE: Heart,
  FOLLOW: UserPlus,
  SYSTEM: Info,
  GYM_UPDATE: Mountain,
};

const NotificationListSection = () => {
  const { markReadMutation } = useNotificationMutations();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["get", "/api/v1/notifications"],
      queryFn: async ({ pageParam }) => {
        const { data } = await fetchClient.GET("/api/v1/notifications", {
          params: { query: { cursor: pageParam, limit: 20 } },
        });
        return data!.payload;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined as string | undefined,
    });

  const notifications = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="pb-8">
      <TopBar
        title="알림"
        action={
          notifications.some((n) => !n.isRead) ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markReadMutation.mutate({})}
            >
              모두 읽음
            </Button>
          ) : undefined
        }
      />

      <div className="mt-2">
        {isLoading ? (
          <div className="space-y-2 px-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-surface-container-low"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="알림이 없습니다"
            description="새로운 소식이 생기면 알려드릴게요"
          />
        ) : (
          <InfiniteScroll
            onLoadMore={fetchNextPage}
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
          >
            <div className="divide-y divide-outline-variant">
              {notifications.map((n) => {
                const Wrapper = n.link ? Link : "div";
                const IconComponent = TYPE_ICONS[n.type] ?? Info;

                return (
                  <Wrapper
                    key={n.id}
                    href={n.link ?? "#"}
                    className={cn(
                      "flex gap-3 px-4 py-3 transition-colors hover:bg-surface-container",
                      !n.isRead && "bg-surface-container-low",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full",
                        !n.isRead
                          ? "bg-primary-container"
                          : "bg-surface-container-high",
                      )}
                    >
                      <IconComponent
                        className={cn(
                          "size-5",
                          !n.isRead
                            ? "text-on-primary-container"
                            : "text-on-surface-variant",
                        )}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-sm",
                          !n.isRead
                            ? "font-medium text-on-surface"
                            : "text-on-surface-variant",
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-on-surface-variant">
                        {n.message}
                      </p>
                      <p className="mt-0.5 text-xs text-on-surface-variant/60">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </Wrapper>
                );
              })}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};
export default NotificationListSection;
