"use client";

import type { FC } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  BellOff,
  Heart,
  Info,
  LogOut,
  MessageCircle,
  Mountain,
  Reply,
  UserPlus,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { fetchClient } from "#web/apis/openapi";
import EmptyState from "#web/components/shared/EmptyState";
import InfiniteScroll from "#web/components/shared/InfiniteScroll";
import { Button } from "#web/components/ui/button";
import { DialogClose } from "#web/components/ui/dialog";
import useNotificationMutations from "#web/hooks/mutations/notifications/useNotificationMutations";
import { cn } from "#web/libs/utils";

/** 알림 타입별 아이콘 매핑 */
const TYPE_ICONS: Record<string, LucideIcon> = {
  COMMENT: MessageCircle,
  POST_COMMENT: MessageCircle,
  COMMENT_REPLY: Reply,
  LIKE: Heart,
  FOLLOW: UserPlus,
  SYSTEM: Info,
  GYM_UPDATE: Mountain,
  AUTO_CHECKOUT: LogOut,
};

interface IProps {
  /** Dialog 패널에서만 우측 상단 닫기 버튼 표시 */
  showCloseButton?: boolean;
}

const NotificationListSection: FC<IProps> = ({
  showCloseButton = false,
}) => {
  const router = useRouter();
  const { markReadMutation, patchReadMutation, deleteMutation } =
    useNotificationMutations();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["get", "/api/v1/notifications"],
      queryFn: async ({ pageParam }) => {
        const { data: res } = await fetchClient.GET("/api/v1/notifications", {
          params: { query: { cursor: pageParam, limit: 20 } },
        });
        return res!.payload;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined as string | undefined,
    });

  const notifications = data?.pages.flatMap((p) => p.items) ?? [];
  const hasUnread = notifications.some((n) => !n.isRead);

  const handleRowActivate = async (n: (typeof notifications)[number]) => {
    if (!n.isRead) {
      await patchReadMutation.mutateAsync({
        params: { path: { id: n.id } },
        body: { isRead: true },
      });
    }
    if (n.link) {
      router.push(n.link);
    }
  };

  return (
    <div className="flex max-h-dvh min-h-0 flex-1 flex-col pb-[env(safe-area-inset-bottom)]">
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-outline-variant/30 bg-background px-6 backdrop-blur-xl">
        <span className="text-lg font-bold text-on-surface">알림</span>
        <div className="flex items-center gap-1">
          {hasUnread ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markReadMutation.mutate({})}
              disabled={markReadMutation.isPending}
            >
              모두 읽음
            </Button>
          ) : null}
          {showCloseButton ? (
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                  aria-label="닫기"
                />
              }
            >
              <XIcon className="size-5" />
            </DialogClose>
          ) : null}
        </div>
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
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
                const IconComponent = TYPE_ICONS[n.type] ?? Info;

                return (
                  <div
                    key={n.id}
                    className={cn(
                      "flex gap-3 px-4 py-3 transition-colors hover:bg-surface-container",
                      !n.isRead && "bg-surface-container-low",
                    )}
                  >
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 gap-3 text-left"
                      onClick={() => void handleRowActivate(n)}
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
                      <div className="min-w-0 flex-1">
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
                        <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">
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
                    </button>
                    <button
                      type="button"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
                      aria-label="알림 삭제"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate({
                          params: { path: { id: n.id } },
                        });
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <XIcon className="size-5" />
                    </button>
                  </div>
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
