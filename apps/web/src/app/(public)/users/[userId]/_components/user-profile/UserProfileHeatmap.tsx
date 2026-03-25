"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#web/components/ui/tooltip";
import { cn } from "#web/libs/utils";

import { formatYmdLongKorean } from "./user-profile-utils";

interface IProps {
  levels: number[];
  dayKeys: string[];
  selectedYmd: string | null;
  onToggleYmd: (ymd: string) => void;
}

const UserProfileHeatmap: React.FC<IProps> = ({
  levels,
  dayKeys,
  selectedYmd,
  onToggleYmd,
}) => {
  const weeks = Math.max(1, Math.floor(dayKeys.length / 7));
  const n = Math.min(dayKeys.length, levels.length);

  return (
    <TooltipProvider delay={200}>
      <div className="overflow-x-auto rounded-xl bg-surface-container-low p-5 ring-1 ring-outline-variant/40">
        <div
          className="grid min-w-72 grid-flow-col grid-rows-7 gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: n }, (_, i) => {
            const ymd = dayKeys[i]!;
            const level = levels[i] ?? 0;
            const hasActivity = level > 0;
            const selected = selectedYmd === ymd;

            return (
              <Tooltip key={ymd}>
                <TooltipTrigger
                  className={cn(
                    "inline-flex size-3.5 shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    hasActivity ? "bg-primary" : "bg-surface-container-highest",
                    selected &&
                      "ring-2 ring-offset-2 ring-offset-surface-container-low ring-primary",
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
    </TooltipProvider>
  );
};

export default UserProfileHeatmap;
