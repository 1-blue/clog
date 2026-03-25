"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { User } from "lucide-react";
import Link from "next/link";

import { openapi } from "#web/apis/openapi";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

/** 미니 막대 높이 비율 (0~1) — 인원 대비 */
const miniBarRatios = (visitorCount: number, maxVisitor: number): number[] => {
  const r = maxVisitor > 0 ? visitorCount / maxVisitor : 0;
  return [
    Math.min(1, 0.2 + r * 0.35),
    Math.min(1, 0.25 + r * 0.55),
    Math.min(1, 0.35 + r * 0.75),
    Math.min(1, 0.45 + r * 0.95),
  ];
};

const rankCaption = (
  rankIndex: number,
  congestion: number,
  visitorCount: number,
): string => {
  if (rankIndex === 0 && visitorCount >= 55) return "현재 가장 많은 인원";
  if (congestion < 35) return "매우 여유로운 상태";
  if (congestion < 55) return "쾌적하게 운동 가능";
  return "다소 붐빔";
};

/** 스티치「홈 피드」— 실시간 혼잡도 순위 (인원 수) */
const CongestionRankingSection = () => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms",
    { params: { query: { sort: "congestion", limit: 3 } } },
    { select: (d) => d.payload },
  );
  const topGyms = data?.items ?? [];
  const maxVisitor = Math.max(1, ...topGyms.map((g) => g.visitorCount));

  const timeLabel = format(new Date(), "HH:mm", { locale: ko });

  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="mb-1 text-2xl font-bold tracking-tight text-on-surface">
            실시간 혼잡도 순위
          </h2>
          <p className="text-xs text-on-surface-variant">
            지금 바로 운동하기 좋은 곳은?
          </p>
        </div>
        <span className="mb-1 text-xs text-outline">{timeLabel} 기준</span>
      </div>

      <div className="scrollbar-hide -mx-2 flex gap-4 overflow-x-auto px-2">
        {topGyms.map((gym, i) => {
          const ratios = miniBarRatios(gym.visitorCount, maxVisitor);
          const caption = rankCaption(i, gym.congestion, gym.visitorCount);
          const isTop = i === 0;

          return (
            <Link
              key={gym.id}
              href={ROUTES.GYMS.DETAIL.path(gym.id)}
              className={cn(
                "flex w-52 shrink-0 flex-col rounded-lg border p-5 transition-transform hover:scale-105",
                isTop
                  ? "border-primary/10 bg-surface-container"
                  : "border-white/5 bg-surface-container-low opacity-90",
              )}
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={cn(
                    "rounded px-2 py-0.5 text-xs font-bold",
                    isTop
                      ? "bg-secondary text-black"
                      : "bg-gray-600 text-on-tertiary",
                  )}
                >
                  {i + 1}위
                </div>
                <div
                  className={cn(
                    "flex items-center text-xs font-medium",
                    isTop ? "text-secondary" : "text-on-surface-variant",
                  )}
                >
                  <User
                    className="mr-1 size-3.5 shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {gym.visitorCount}명
                </div>
              </div>

              <h3 className="mb-4 truncate text-sm font-bold text-on-surface">
                {gym.name}
              </h3>

              <div className="flex h-16 w-full items-end gap-1.5 px-1">
                {ratios.map((ratio, barIdx) => (
                  <div
                    key={barIdx}
                    className={cn(
                      "flex-1 rounded-t-sm",
                      isTop && barIdx === 3
                        ? "animate-pulse bg-primary"
                        : isTop && barIdx === 2
                          ? "bg-primary/40"
                          : !isTop && barIdx >= 2
                            ? "bg-primary/30"
                            : "bg-white/10",
                    )}
                    style={{
                      height: `${Math.max(18, Math.round(ratio * 64))}px`,
                    }}
                  />
                ))}
              </div>

              <p
                className={cn(
                  "mt-3 text-center text-xs font-medium",
                  isTop ? "text-primary/80" : "text-outline",
                )}
              >
                {caption}
              </p>
            </Link>
          );
        })}
        {topGyms.length === 0 && (
          <p className="w-full py-8 text-center text-sm text-on-surface-variant">
            등록된 암장이 없습니다
          </p>
        )}
      </div>
    </section>
  );
};

export default CongestionRankingSection;
