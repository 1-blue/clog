"use client";

import { Flame, Timer, Trophy } from "lucide-react";

import type { components } from "#web/@types/openapi";
import { cn } from "#web/libs/utils";

import {
  difficultySpreadLabel,
  estimateKcal,
  maxDifficultyLabel,
  sendCount,
  type IExerciseTimeSummary,
} from "./record-detail-utils";

type RecordDetail = components["schemas"]["RecordDetail"];

interface IProps {
  record: RecordDetail;
  exercise: IExerciseTimeSummary | null;
  className?: string;
}

const RecordDetailStatsPanel = ({ record, exercise, className }: IProps) => {
  const sends = sendCount(record.routes);
  const best = maxDifficultyLabel(record.routes);
  const spread = difficultySpreadLabel(record.routes);
  const kcal = exercise != null ? estimateKcal(exercise.durationMin) : null;

  return (
    <div className={cn("mt-4 space-y-4", className)}>
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/8 px-4 py-4">
        <div>
          <p className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
            총 완등
          </p>
          <p className="text-3xl font-bold text-primary tabular-nums">
            {sends}회
          </p>
        </div>
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15">
          <Trophy className="size-7 text-primary" strokeWidth={2} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-surface-container-high px-3 py-3.5">
          <p className="text-xs font-bold text-on-surface-variant">
            평균 난이도
          </p>
          <p className="mt-1 text-base font-bold text-on-surface">{spread}</p>
        </div>
        <div className="rounded-2xl bg-surface-container-high px-3 py-3.5">
          <p className="text-xs font-bold text-on-surface-variant">
            최고 난이도
          </p>
          <p className="mt-1 text-base font-bold text-tertiary">{best}</p>
        </div>
        <div className="rounded-2xl bg-surface-container-high px-3 py-3.5">
          <p className="flex items-center gap-1 text-xs font-bold text-on-surface-variant">
            <Timer className="size-3.5" strokeWidth={2} />
            운동 시간
          </p>
          {exercise ? (
            <>
              <p className="mt-1 text-sm leading-snug font-bold text-on-surface">
                {exercise.totalLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-on-surface-variant tabular-nums">
                ( {exercise.rangeLabel} )
              </p>
            </>
          ) : (
            <p className="mt-1 text-base font-bold text-on-surface">—</p>
          )}
        </div>
        <div className="rounded-2xl bg-surface-container-high px-3 py-3.5">
          <p className="flex items-center gap-1 text-xs font-bold text-on-surface-variant">
            <Flame className="size-3.5" strokeWidth={2} />
            소모 칼로리
          </p>
          <p className="mt-1 text-base font-bold text-on-surface">
            {kcal != null ? `${kcal} kcal` : "—"}
          </p>
          <p className="mt-0.5 text-xs text-on-surface-variant/80">추정치</p>
        </div>
      </div>
    </div>
  );
};

export default RecordDetailStatsPanel;
