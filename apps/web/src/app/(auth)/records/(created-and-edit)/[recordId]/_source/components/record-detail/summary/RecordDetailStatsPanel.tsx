"use client";

import { Flame, Timer, Trophy } from "lucide-react";

import { attemptResultToKoreanMap, type AttemptResult } from "@clog/contracts";

import type { components } from "#web/@types/openapi";
import type { TGymDifficultyColor } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";
import {
  attemptResultBreakdown,
  difficultySpreadGradeLabel,
  difficultySpreadLabel,
  difficultySpreadLabelWithGym,
  estimateKcal,
  maxDifficultyGradeLabel,
  maxDifficultyLabel,
  maxDifficultyLabelWithGym,
  sendCount,
  type IExerciseTimeSummary,
} from "#web/app/(auth)/records/(created-and-edit)/_source/utils/record-detail-utils";
import { cn } from "#web/libs/utils";

type RecordDetail = components["schemas"]["RecordDetail"];

const RESULT_ORDER: AttemptResult[] = ["SEND", "FLASH", "ONSIGHT", "ATTEMPT"];

interface IProps {
  record: RecordDetail;
  exercise: IExerciseTimeSummary | null;
  difficultyColors?: TGymDifficultyColor[];
  className?: string;
}

const RecordDetailStatsPanel = ({
  record,
  exercise,
  difficultyColors,
  className,
}: IProps) => {
  const sends = sendCount(record.routes);
  const hasGymColors = Boolean(difficultyColors?.length);
  const best = hasGymColors
    ? maxDifficultyLabelWithGym(record.routes, difficultyColors)
    : maxDifficultyLabel(record.routes);
  const spread = hasGymColors
    ? difficultySpreadLabelWithGym(record.routes, difficultyColors)
    : difficultySpreadLabel(record.routes);
  const spreadGrade = difficultySpreadGradeLabel(record.routes);
  const bestGrade = maxDifficultyGradeLabel(record.routes);
  const kcal = exercise != null ? estimateKcal(exercise.durationMin) : null;
  const breakdown = attemptResultBreakdown(record.routes);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
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

      <div>
        <p className="text-xs font-bold text-on-surface-variant">결과 요약</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {RESULT_ORDER.map((key) => (
            <div
              key={key}
              className="rounded-xl bg-surface-container-high px-2.5 py-2 text-center"
            >
              <p className="text-[11px] font-medium text-on-surface-variant">
                {attemptResultToKoreanMap[key]}
              </p>
              <p className="mt-0.5 text-lg font-bold text-on-surface tabular-nums">
                {breakdown[key]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-high px-3 py-3.5">
          <p className="text-xs font-bold text-on-surface-variant">
            평균 난이도
          </p>
          <p className="text-base font-bold text-on-surface tabular-nums">
            {spreadGrade}
          </p>
          <p className="text-sm leading-snug font-semibold text-on-surface">
            {spread}
          </p>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-high px-3 py-3.5">
          <p className="text-xs font-bold text-on-surface-variant">
            최고 난이도
          </p>
          <p className="text-base font-bold text-on-surface tabular-nums">
            {bestGrade}
          </p>
          <p className="text-sm leading-snug font-semibold text-on-surface">
            {best}
          </p>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-high px-3 py-3.5">
          <p className="flex items-center gap-1 text-xs font-bold text-on-surface-variant">
            <Timer className="size-3.5" strokeWidth={2} />
            운동 시간
          </p>
          {exercise ? (
            <>
              <p className="text-sm leading-snug font-bold text-on-surface">
                {exercise.totalLabel}
              </p>
              <p className="text-sm font-semibold text-on-surface-variant tabular-nums">
                ( {exercise.rangeLabel} )
              </p>
            </>
          ) : (
            <p className="text-base font-bold text-on-surface">—</p>
          )}
        </div>

        <div className="flex flex-col gap-1 rounded-2xl bg-surface-container-high px-3 py-3.5">
          <p className="flex items-center gap-1 text-xs font-bold text-on-surface-variant">
            <Flame className="size-3.5" strokeWidth={2} />
            소모 칼로리
          </p>
          <p className="text-base font-bold text-on-surface">
            {kcal != null ? `${kcal} kcal` : "—"}
          </p>
          <p className="mt-0.5 text-xs text-on-surface-variant/80">추정치</p>
        </div>
      </div>
    </div>
  );
};

export default RecordDetailStatsPanel;
