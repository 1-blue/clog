"use client";

import { CheckCircle2, CircleDashed, Zap } from "lucide-react";

import {
  difficultyToKoreanMap,
  perceivedDifficultyToKoreanMap,
  type AttemptResult,
  type Difficulty,
  type PerceivedDifficulty,
} from "@clog/utils";

import type { components } from "#web/@types/openapi";
import {
  getDifficultyChipPresentation,
  getDifficultyLabelForGym,
  type TGymDifficultyColor,
} from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";
import {
  routeRowSubtitle,
  routeRowTitle,
} from "#web/app/(auth)/records/(created-and-edit)/_source/utils/record-detail-utils";
import { cn } from "#web/libs/utils";

type Route = components["schemas"]["Route"];

interface IProps {
  route: Route;
  difficultyColors?: TGymDifficultyColor[];
  className?: string;
}

const RecordDetailRouteRow = ({
  route,
  difficultyColors,
  className,
}: IProps) => {
  const d = route.difficulty as Difficulty;
  const result = route.result as AttemptResult;
  const presentation = getDifficultyChipPresentation(d, difficultyColors);

  const chipNode =
    presentation.kind === "gym" ? (
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          backgroundColor: presentation.backgroundColor,
          color: presentation.foregroundColor,
        }}
      >
        {presentation.label}
      </div>
    ) : (
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          presentation.rainbow.chipClass,
          presentation.rainbow.gradeTextClass,
        )}
      >
        {difficultyToKoreanMap[d]}
      </div>
    );

  const memoTrim = route.memo?.trim() ?? "";
  const longMemo = memoTrim.length > 48;
  const title = longMemo
    ? `${getDifficultyLabelForGym(d, difficultyColors)} 홀드`
    : routeRowTitle(d, route.memo ?? null);

  const perceived = route.perceivedDifficulty as
    | PerceivedDifficulty
    | undefined;
  const perceivedLabel =
    perceived && perceived in perceivedDifficultyToKoreanMap
      ? perceivedDifficultyToKoreanMap[perceived]
      : null;

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
        "flex items-start justify-between gap-3 rounded-2xl border border-outline-variant/25 bg-surface-container-highest px-4 py-3.5",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {chipNode}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-on-surface">{title}</p>
          <p className="text-sm text-on-surface-variant">
            {routeRowSubtitle(route.attempts, result)}
            {perceivedLabel ? ` · 체감 ${perceivedLabel}` : ""}
          </p>
          {longMemo ? (
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-on-surface-variant">
              {memoTrim}
            </p>
          ) : null}
        </div>
      </div>
      <Icon className={cn("size-6 shrink-0", iconClass)} strokeWidth={2} />
    </div>
  );
};

export default RecordDetailRouteRow;
