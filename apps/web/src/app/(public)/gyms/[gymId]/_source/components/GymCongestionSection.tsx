import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "#web/libs/utils";

import {
  CONGESTION_CHART_HOURS,
  flowLabel,
  getSeoulCongestionClock,
  type TCongestionLogRow,
} from "../utils/congestion";

interface IProps {
  visitorCount: number;
  capacity: number;
  congestionLogs: TCongestionLogRow[];
  onRefresh: () => void | Promise<unknown>;
}

/** Y축: -5 ~ 60(명), 총 65 스케일 */
const Y_AXIS_MIN = -5;
const BAR_MAX = 60;
const Y_RANGE = BAR_MAX - Y_AXIS_MIN;

const barFillClass = (i: number, currentIndex: number) => {
  if (i === currentIndex) return "bg-primary";
  return "bg-primary/20";
};

const GymCongestionSection: React.FC<IProps> = ({
  visitorCount,
  capacity,
  onRefresh,
}) => {
  const [displayedAt, setDisplayedAt] = useState(() => new Date());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // MVP A: “현재 활성 체크인 인원”만 반영 (시간대별 히스토리 없음)
  // Y축 스케일 -5~60(명). 막대는 하단(y=-5)부터 채움. 라벨은 0부터만 표시.

  const barValue = useMemo(
    () => Math.max(0, Math.min(BAR_MAX, visitorCount)),
    [visitorCount],
  );

  /** Y값 v가 차트 아래(0%) ~ 위(100%) 중 어디에 오는지 */
  const yPercentFromValue = (value: number) =>
    ((value - Y_AXIS_MIN) / Y_RANGE) * 100;

  /** 막대: y=-5(차트 하단)부터 y=barValue까지. 0명이어도 -5~0 구간만큼은 채워짐 */
  const barHeightPct = useMemo(
    () => ((barValue - Y_AXIS_MIN) / Y_RANGE) * 100,
    [barValue],
  );

  const currentIndex = useMemo(() => {
    const clock = getSeoulCongestionClock(displayedAt);
    if (!clock) return 6;

    const hour = clock.hour;
    const minHour = CONGESTION_CHART_HOURS[0]!;
    const maxHour = CONGESTION_CHART_HOURS[CONGESTION_CHART_HOURS.length - 1]!;

    if (hour < minHour || hour > maxHour) return 6;
    return hour - minHour;
  }, [displayedAt]);

  const timeLabel = format(displayedAt, "HH:mm", { locale: ko });

  const handleRefresh = () => {
    void Promise.resolve(onRefresh()).finally(() => {
      setDisplayedAt(new Date());
    });
  };

  const hoveredHour = useMemo(() => {
    if (hoveredIndex == null) return null;
    return CONGESTION_CHART_HOURS[hoveredIndex] ?? null;
  }, [hoveredIndex]);

  /** 격자선: -5~60, 5명 단위 */
  const yGridTicks = useMemo(
    () => Array.from({ length: 14 }, (_, i) => Y_AXIS_MIN + i * 5),
    [],
  );

  /** Y축 숫자 라벨: -5는 스케일만 쓰고 표시는 생략 */
  const yLabelTicks = useMemo(() => [0, 10, 20, 30, 40, 50, 60], []);

  const hasVisitors = visitorCount > 0;

  return (
    <section className="px-6 pb-2">
      <div className="rounded-2xl border border-white/5 bg-surface-container-low px-6 py-4">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h4 className="mb-1 flex items-center gap-2 text-lg font-bold text-on-surface">
              실시간 혼잡도
              <span className="inline-block size-2 animate-pulse rounded-full bg-secondary" />
            </h4>
            <p className="text-xs text-on-surface-variant">
              이 그래프는 현재 활성 체크인(진행 중) 인원만 반영합니다.
              <br />
              시간대별 히스토리는 추후 고도화되어 제공될 예정이에요.
            </p>
          </div>

          <div className="shrink-0 text-right">
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

        {/* 차트 + Y축 */}
        <div className="flex items-end gap-3">
          <div className="relative h-40 w-4 shrink-0">
            {yLabelTicks.map((t) => {
              const isMax = t === BAR_MAX;
              const pct = yPercentFromValue(t);

              return (
                <div
                  key={t}
                  className={cn(
                    "absolute right-0 translate-x-1 text-[10px] leading-none text-on-surface-variant/80",
                    !isMax ? "translate-y-1/2" : "",
                  )}
                  style={isMax ? { top: "0%" } : { bottom: `${pct}%` }}
                  aria-hidden
                >
                  {t}
                </div>
              );
            })}
          </div>

          <div className="relative flex h-40 flex-1 items-end gap-1 px-0.5 sm:gap-1.5">
            {/* Y축 5명 단위 격자선 (-5~60) */}
            <div className="pointer-events-none absolute inset-0">
              {yGridTicks.map((t) => {
                const isEdge = t === Y_AXIS_MIN || t === BAR_MAX;
                const pct = yPercentFromValue(t);
                return (
                  <div
                    key={t}
                    className={cn(
                      "absolute right-0 left-0 h-0 border-b",
                      isEdge
                        ? "border-outline-variant/20"
                        : "border-outline-variant/10",
                    )}
                    style={{ bottom: `${pct}%` }}
                    aria-hidden
                  />
                );
              })}
            </div>

            {CONGESTION_CHART_HOURS.map((_, i) => {
              const isCurrent = i === currentIndex;
              const showRing = isCurrent && hasVisitors;

              const showTooltip = hoveredIndex === i;
              const hoveredText =
                hoveredHour == null ? "" : `${hoveredHour}:00`;

              return (
                <div
                  key={i}
                  className="relative h-full min-h-0 flex-1 rounded-t-sm transition-all"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(i)}
                  onBlur={() => setHoveredIndex(null)}
                  tabIndex={0}
                  aria-label={`시간 ${CONGESTION_CHART_HOURS[i]}:00, 활성 ${visitorCount}명`}
                >
                  {showTooltip ? (
                    <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg border border-white/10 bg-background/90 px-2 py-1 text-[11px] shadow-lg backdrop-blur-sm">
                      <div className="font-bold text-on-surface">
                        {hoveredText}
                      </div>
                      <div className="text-on-surface-variant">
                        {visitorCount}명
                      </div>
                    </div>
                  ) : null}

                  <div
                    className={cn(
                      "absolute w-full rounded-t-sm",
                      barFillClass(i, currentIndex),
                      showRing ? "ring-2 ring-primary/45" : "",
                    )}
                    style={{
                      bottom: "0%",
                      height: `${barHeightPct}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X축 라벨 */}
        <div className="mt-4 flex items-center">
          <div className="w-10 shrink-0" aria-hidden />
          <div className="flex flex-1 justify-between text-xs font-medium text-on-surface-variant">
            <span>10:00</span>
            <span className="font-bold text-primary">현재 ({timeLabel})</span>
            <span>22:00</span>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleRefresh}
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
