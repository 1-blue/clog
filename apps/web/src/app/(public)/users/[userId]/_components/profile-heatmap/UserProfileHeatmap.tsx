"use client";

import { parseISO, startOfDay } from "date-fns";
import { useLayoutEffect, useMemo, useRef } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#web/components/ui/tooltip";
import { getKoreaTodayYmd } from "#web/libs/date/korea";
import { cn } from "#web/libs/utils";

import { formatYmdLongKorean } from "./heatmap-utils";

/** 히트맵 집계 시작일과 동일 — 이전 연·월 라벨은 표시하지 않음 */
const HEATMAP_START = startOfDay(new Date(2026, 0, 1));

/** GitHub 스타일: 월·수·금 행에만 라벨 (시각적 여백) */
const ROW_LABELS: (string | null)[] = [
  "월",
  null,
  "수",
  null,
  "금",
  null,
  "일",
];

/** 활동 일수·세션 수와 관계없이 동일 색 (단계 구분 없음) */
const activityCellClass = (hasActivity: boolean) =>
  hasActivity ? "bg-primary/80" : "bg-surface-container-highest";

interface IProps {
  levels: number[];
  dayKeys: string[];
  selectedYmd: string | null;
  onToggleYmd: (ymd: string) => void;
  sessionCountInRange: number;
}

const UserProfileHeatmap: React.FC<IProps> = ({
  levels,
  dayKeys,
  selectedYmd,
  onToggleYmd,
  sessionCountInRange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayYmd = useMemo(() => getKoreaTodayYmd(), []);

  const weeks = Math.max(0, Math.floor(dayKeys.length / 7));
  const n = Math.min(dayKeys.length, levels.length);

  const monthLabels = useMemo(() => {
    const labels: (string | null)[] = [];
    for (let w = 0; w < weeks; w++) {
      const mondayKey = dayKeys[w * 7];
      if (!mondayKey) {
        labels.push(null);
        continue;
      }
      const d = parseISO(`${mondayKey}T12:00:00`);
      if (d < HEATMAP_START) {
        labels.push(null);
        continue;
      }
      const prevKey = w > 0 ? dayKeys[(w - 1) * 7] : null;
      const prevD = prevKey ? parseISO(`${prevKey}T12:00:00`) : null;
      const show =
        prevD === null ||
        d.getMonth() !== prevD.getMonth() ||
        d.getFullYear() !== prevD.getFullYear();
      if (!show) {
        labels.push(null);
        continue;
      }
      labels.push(`${d.getMonth() + 1}월`);
    }
    return labels;
  }, [dayKeys, weeks]);

  useLayoutEffect(() => {
    if (!scrollRef.current || weeks === 0) return;
    const el = scrollRef.current.querySelector(
      `[data-ymd="${todayYmd}"]`,
    ) as HTMLElement | null;
    el?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [todayYmd, weeks, dayKeys.length]);

  if (weeks === 0 || n === 0) {
    return (
      <div className="rounded-xl bg-surface-container-low px-4 py-6 text-center text-sm text-on-surface-variant ring-1 ring-outline-variant/40">
        아직 표시할 활동 구간이 없습니다.
      </div>
    );
  }

  const colTemplate = `repeat(${weeks}, minmax(0, 0.875rem))`;

  return (
    <TooltipProvider delay={200}>
      <div className="rounded-xl bg-surface-container-low px-3 py-3 ring-1 ring-outline-variant/40">
        <div ref={scrollRef} className="overflow-x-auto pb-1">
          <div className="inline-flex min-w-min gap-1.5">
            <div className="flex shrink-0 flex-col gap-[3px] pt-5 pr-0.5 pb-0.5">
              {ROW_LABELS.map((label, row) => (
                <div
                  key={row}
                  className="flex h-3.5 items-center justify-end text-[10px] leading-none text-on-surface-variant/80"
                >
                  {label ?? ""}
                </div>
              ))}
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <div
                className="grid gap-[3px]"
                style={{ gridTemplateColumns: colTemplate }}
              >
                {monthLabels.map((m, w) => (
                  <div
                    key={`m-${w}`}
                    className="h-4 min-w-0 text-left text-[10px] whitespace-nowrap text-on-surface-variant/90"
                  >
                    {m ?? ""}
                  </div>
                ))}
              </div>
              <div
                className="grid min-w-72 grid-flow-col grid-rows-7 gap-1"
                style={{ gridTemplateColumns: colTemplate }}
              >
                {Array.from({ length: n }, (_, i) => {
                  const ymd = dayKeys[i]!;
                  const level = levels[i] ?? 0;
                  const hasActivity = level > 0;
                  const selected = selectedYmd === ymd;

                  return (
                    <Tooltip key={ymd}>
                      <TooltipTrigger
                        data-ymd={ymd}
                        className={cn(
                          "inline-flex size-3.5 shrink-0 rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          activityCellClass(hasActivity),
                          selected &&
                            "ring-2 ring-primary ring-offset-1 ring-offset-surface-container-low",
                        )}
                        onClick={() => onToggleYmd(ymd)}
                        aria-label={`${formatYmdLongKorean(ymd)}${hasActivity ? ", 기록 있음" : ", 기록 없음"}${selected ? ", 선택됨" : ""}`}
                        aria-pressed={selected}
                      />
                      <TooltipContent side="top">
                        {formatYmdLongKorean(ymd)}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/30 pt-3 text-[11px] text-on-surface-variant">
          <span className="whitespace-nowrap">
            2026년{" "}
            <span className="font-semibold text-on-surface">
              {sessionCountInRange}
            </span>
            개의 공개 기록
          </span>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-on-surface-variant/70">Less</span>
            <span className="size-3.5 shrink-0 rounded-[3px] bg-surface-container-highest" />
            <span className="text-on-surface-variant/70">More</span>
            <span className="size-3.5 shrink-0 rounded-[3px] bg-primary/80" />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default UserProfileHeatmap;
