import { User } from "lucide-react";
import Link from "next/link";

import { components } from "#web/@types/openapi";
import { ROUTES } from "#web/constants";
import { cn } from "#web/libs/utils";

/** 미니 막대 높이 비율 (0~1) — 인원 대비 */
const miniBarRatios = (visitorCount: number, maxVisitor: number) => {
  const r = maxVisitor > 0 ? visitorCount / maxVisitor : 0;

  return [
    Math.min(1, 0.2 + r * 0.35),
    Math.min(1, 0.25 + r * 0.55),
    Math.min(1, 0.35 + r * 0.75),
    Math.min(1, 0.45 + r * 0.95),
  ];
};

const rankCaption = (congestionScore: number, visitorCount: number) => {
  if (visitorCount >= 55) return "현재 가장 많은 인원";
  if (congestionScore < 35) return "매우 여유로운 상태";
  if (congestionScore < 55) return "쾌적하게 운동 가능";
  return "다소 붐빔";
};

interface IProps {
  gym: components["schemas"]["GymListItem"];
  maxVisitor: number;
  index: number;
}

const CongestionRankingCard: React.FC<IProps> = ({
  gym,
  maxVisitor,
  index,
}) => {
  const ratios = miniBarRatios(gym.visitorCount, maxVisitor);
  const congestionScore = Math.max(
    0,
    Math.min(
      100,
      Math.round((gym.visitorCount / Math.max(1, gym.visitorCapacity)) * 100),
    ),
  );
  const caption = rankCaption(congestionScore, gym.visitorCount);
  const isTop = index === 0;

  const getBarFillClass = (barIdx: number) => {
    if (isTop && barIdx === 3) return "animate-pulse bg-primary";
    if (isTop && barIdx === 2) return "bg-primary/40";
    if (!isTop && barIdx >= 2) return "bg-primary/30";
    return "bg-white/10";
  };

  return (
    <Link
      key={gym.id}
      href={ROUTES.GYMS.DETAIL.path(gym.id)}
      className={cn(
        "flex w-52 shrink-0 flex-col rounded-lg border p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
        isTop
          ? "border-primary/10 bg-surface-container"
          : "border-white/5 bg-surface-container-low opacity-90",
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className={cn(
            "rounded px-2 py-0.5 text-xs font-bold",
            isTop ? "bg-secondary text-black" : "text-on-tertiary bg-gray-600",
          )}
        >
          {index + 1}위
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
            className={cn("flex-1 rounded-t-sm", getBarFillClass(barIdx))}
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
};

export default CongestionRankingCard;
