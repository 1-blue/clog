import { CalendarCheck, Gauge, Users } from "lucide-react";

import { Badge } from "#web/components/ui/badge";
import { cn } from "#web/libs/utils";

interface IProps {
  congestion: number;
  visitorCount: number;
  visitorCapacity: number;
  monthlyCheckInCount: number | null | undefined;
  className?: string;
}

const congestionTier = (pct: number) => {
  const c = Math.max(0, Math.min(100, Math.round(pct)));
  if (c <= 33) return { label: "여유", color: "secondary" as const };
  if (c <= 66) return { label: "보통", color: "tertiary" as const };
  return { label: "혼잡", color: "destructive" as const };
};

/** 혼잡도·실시간 인원·이번 달 체크인 요약 */
const GymLiveStatsStrip: React.FC<IProps> = ({
  congestion,
  visitorCount,
  visitorCapacity,
  monthlyCheckInCount,
  className,
}) => {
  const pct = Math.max(0, Math.min(100, Math.round(congestion)));
  const tier = congestionTier(pct);
  const monthly =
    monthlyCheckInCount != null && Number.isFinite(monthlyCheckInCount)
      ? monthlyCheckInCount
      : null;

  return (
    <section
      className={cn("relative z-10 w-full pb-2", className)}
      aria-label="실시간 현황"
    >
      <div className="space-y-3 rounded-2xl border border-white/10 bg-surface-container-low/95 p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <Gauge className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="text-xs font-medium text-on-surface-variant">
            혼잡도
          </span>
          <Badge
            variant={tier.color === "destructive" ? "destructive" : "outline"}
            color={tier.color === "destructive" ? undefined : tier.color}
            className="h-5 px-1.5 text-[10px] font-bold"
          >
            {tier.label}
          </Badge>
          <span className="ml-auto text-sm font-semibold text-on-surface tabular-nums">
            {pct}%
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-surface-container-high"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`혼잡도 ${pct}퍼센트`}
        >
          <div
            className="h-full rounded-full bg-primary/80 transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-white/5 pt-3 text-sm sm:grid-cols-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <Users
              className="size-4 shrink-0 text-on-surface-variant"
              aria-hidden
            />
            <span className="shrink-0 text-on-surface-variant">지금</span>
            <span className="min-w-0 font-semibold text-on-surface tabular-nums">
              {visitorCount}
              <span className="font-medium text-on-surface-variant">
                {" "}
                / {visitorCapacity}명
              </span>
            </span>
          </div>
          {monthly !== null ? (
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <CalendarCheck
                  className="size-4 shrink-0 text-on-surface-variant"
                  aria-hidden
                />
                <span className="text-on-surface-variant">이번 달 체크인</span>
              </div>
              <span className="shrink-0 font-semibold text-on-surface tabular-nums">
                {monthly.toLocaleString("ko-KR")}회
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default GymLiveStatsStrip;
