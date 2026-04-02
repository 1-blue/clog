"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

import type { TStatisticsPeriod } from "@clog/utils";

import { cn } from "#web/libs/utils";

import { shiftAnchor } from "../../utils/statisticsPeriodNav";

const PERIODS: { value: TStatisticsPeriod; label: string }[] = [
  { value: "week", label: "주간" },
  { value: "month", label: "월간" },
  { value: "year", label: "연간" },
  { value: "all", label: "전체" },
];

interface IProps {
  period: TStatisticsPeriod;
  onPeriodChange: (p: TStatisticsPeriod) => void;
  anchor: Date;
  onAnchorChange: (d: Date) => void;
  rangeLabel: string;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const PeriodControl: React.FC<IProps> = ({
  period,
  onPeriodChange,
  anchor,
  onAnchorChange,
  rangeLabel,
  canGoPrev,
  canGoNext,
}) => {
  const canShift = period !== "all";

  const onPrev = useCallback(() => {
    if (!canShift || !canGoPrev) return;
    onAnchorChange(shiftAnchor(period, anchor, -1));
  }, [anchor, canGoPrev, canShift, onAnchorChange, period]);

  const onNext = useCallback(() => {
    if (!canShift || !canGoNext) return;
    onAnchorChange(shiftAnchor(period, anchor, 1));
  }, [anchor, canGoNext, canShift, onAnchorChange, period]);

  return (
    <div className="space-y-4">
      <div
        className="flex gap-1 rounded-full bg-surface-container-highest p-1.5"
        role="tablist"
        aria-label="통계 기간"
      >
        {PERIODS.map(({ value, label }) => {
          const active = period === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              className={cn(
                "flex-1 rounded-full py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "bg-primary text-black"
                  : "text-on-surface-variant hover:bg-surface-container",
              )}
              onClick={() => onPeriodChange(value)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 text-on-surface-variant">
        <button
          type="button"
          className={cn(
            "rounded-full p-1 hover:bg-surface-container-high",
            !canShift && "invisible pointer-events-none",
            canShift && !canGoPrev && "pointer-events-none opacity-30",
          )}
          aria-label="이전 기간"
          disabled={!canShift || !canGoPrev}
          onClick={onPrev}
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-medium tracking-wide">{rangeLabel}</span>
        <button
          type="button"
          className={cn(
            "rounded-full p-1 hover:bg-surface-container-high",
            !canShift && "invisible pointer-events-none",
            canShift && !canGoNext && "pointer-events-none opacity-30",
          )}
          aria-label="다음 기간"
          disabled={!canShift || !canGoNext}
          onClick={onNext}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default PeriodControl;
