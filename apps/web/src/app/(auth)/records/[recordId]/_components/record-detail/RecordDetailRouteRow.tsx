"use client";

import { CheckCircle2, CircleDashed, Zap } from "lucide-react";

import {
  difficultyToKoreanMap,
  getRouteRainbowStyleForDifficulty,
  type AttemptResult,
  type Difficulty,
} from "@clog/utils";

import type { components } from "#web/@types/openapi";
import { cn } from "#web/libs/utils";

import { routeRowSubtitle, routeRowTitle } from "./record-detail-utils";

type Route = components["schemas"]["Route"];

interface IProps {
  route: Route;
  className?: string;
}

const RecordDetailRouteRow = ({ route, className }: IProps) => {
  const d = route.difficulty as Difficulty;
  const result = route.result as AttemptResult;
  const rainbow = getRouteRainbowStyleForDifficulty(d);

  const Icon =
    result === "FLASH" || result === "ONSIGHT"
      ? Zap
      : result !== "ATTEMPT"
        ? CheckCircle2
        : CircleDashed;

  const iconClass =
    result === "ATTEMPT"
      ? "text-on-surface-variant"
      : result === "FLASH" || result === "ONSIGHT"
        ? "text-amber-400"
        : "text-secondary";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl border border-outline-variant/25 bg-surface-container-highest px-4 py-3.5",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            rainbow.chipClass,
            rainbow.gradeTextClass,
          )}
        >
          {difficultyToKoreanMap[d]}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-on-surface">
            {routeRowTitle(d, route.memo)}
          </p>
          <p className="text-sm text-on-surface-variant">
            {routeRowSubtitle(route.attempts, result)}
          </p>
        </div>
      </div>
      <Icon className={cn("size-6 shrink-0", iconClass)} strokeWidth={2} />
    </div>
  );
};

export default RecordDetailRouteRow;
