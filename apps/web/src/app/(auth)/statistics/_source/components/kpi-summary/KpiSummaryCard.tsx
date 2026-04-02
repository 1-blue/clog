"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "#web/libs/utils";

interface IProps {
  icon: LucideIcon;
  label: string;
  value: string;
  /** 이전 기간 대비 완등 증감률 (↑/↓) */
  deltaPercent?: number | null;
  /** 완등/전체 루트 비율 (초록 배지, %만 표시) */
  successRatePercent?: number | null;
  className?: string;
}

const KpiSummaryCard: React.FC<IProps> = ({
  icon: Icon,
  label,
  value,
  deltaPercent,
  successRatePercent,
  className,
}) => {
  const showSuccessRate =
    successRatePercent !== null &&
    successRatePercent !== undefined &&
    !Number.isNaN(successRatePercent);
  const showDelta =
    !showSuccessRate &&
    deltaPercent !== null &&
    deltaPercent !== undefined &&
    !Number.isNaN(deltaPercent);

  return (
    <div
      className={cn(
        "space-y-3 rounded-2xl bg-surface-container-low p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <Icon className="size-7 text-primary" strokeWidth={2} aria-hidden />
        {showSuccessRate ? (
          <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold text-secondary">
            {successRatePercent}%
          </span>
        ) : showDelta ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold",
              deltaPercent >= 0
                ? "bg-secondary/15 text-secondary"
                : "bg-destructive/15 text-destructive",
            )}
          >
            {deltaPercent >= 0 ? "↑" : "↓"} {Math.abs(deltaPercent)}%
          </span>
        ) : (
          <span className="size-6" aria-hidden />
        )}
      </div>
      <div>
        <p className="text-[11px] font-medium tracking-widest text-on-surface-variant uppercase">
          {label}
        </p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-on-surface">
          {value}
        </p>
      </div>
    </div>
  );
};

export default KpiSummaryCard;
