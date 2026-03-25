import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { RefreshCw } from "lucide-react";
import { useMemo } from "react";

import { cn } from "#web/libs/utils";

import { congestionBarHeights, flowLabel } from "../utils/congestion";

interface IProps {
  visitorCount: number;
  capacity: number;
  onRefresh: () => void;
}

const GymCongestionSection: React.FC<IProps> = ({
  visitorCount,
  capacity,
  onRefresh,
}) => {
  const barHeights = useMemo(
    () => congestionBarHeights(visitorCount, capacity),
    [visitorCount, capacity],
  );

  const timeLabel = format(new Date(), "HH:mm", { locale: ko });

  return (
    <section className="px-6 pb-2">
      <div className="rounded-2xl border border-white/5 bg-surface-container-low p-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h4 className="mb-1 flex items-center gap-2 text-lg font-bold text-on-surface">
              실시간 혼잡도
              <span className="inline-block size-2 animate-pulse rounded-full bg-secondary" />
            </h4>
            <p className="text-xs text-on-surface-variant">
              현재 체크인 인원 기준
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-3xl font-bold text-primary">
                {visitorCount}
              </span>
              <span className="text-sm font-medium text-on-surface-variant">
                / {capacity}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-bold tracking-tight text-secondary">
              {flowLabel(visitorCount, capacity)}
            </p>
          </div>
        </div>

        <div className="relative flex h-32 items-end gap-2 px-1">
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between border-b border-outline-variant/20">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-0 w-full border-b border-outline-variant/10"
              />
            ))}
          </div>
          {barHeights.map((h, i) => {
            const isCurrent = i === 4;
            return (
              <div
                key={i}
                className={cn(
                  "relative h-full min-h-0 flex-1 rounded-t-sm transition-all",
                  isCurrent ? "shadow-lg shadow-primary/30" : "",
                )}
              >
                <div
                  className={cn(
                    "absolute bottom-0 w-full rounded-t-sm",
                    isCurrent
                      ? "bg-primary"
                      : i === 5
                        ? "bg-primary/60"
                        : i === 3
                          ? "bg-primary/50"
                          : i === 2
                            ? "bg-primary/30"
                            : "bg-surface-container-highest/30",
                  )}
                  style={{ height: `${Math.round(h * 100)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between text-xs font-medium text-on-surface-variant">
          <span>10:00</span>
          <span className="font-bold text-primary">현재 ({timeLabel})</span>
          <span>22:00</span>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => void onRefresh()}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1.5 text-xs text-on-surface-variant hover:text-primary"
          >
            <RefreshCw className="size-3.5" strokeWidth={2} aria-hidden />
            새로고침
          </button>
        </div>
      </div>
    </section>
  );
};

export default GymCongestionSection;
