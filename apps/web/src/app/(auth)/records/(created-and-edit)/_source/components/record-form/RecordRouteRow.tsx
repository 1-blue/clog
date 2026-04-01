"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import {
  attemptResultToKoreanMap,
  difficultyToKoreanMap,
  getRouteRainbowStyleForDifficulty,
  type AttemptResult,
  type Difficulty,
} from "@clog/utils";

import type { TGymDifficultyColor } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";
import { getDifficultyChipPresentation } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";
import { cn } from "#web/libs/utils";

interface IProps {
  difficulty: Difficulty;
  result: AttemptResult;
  attempts: number;
  onChangeAttempts: (n: number) => void;
  onRemove: () => void;
  /** 암장 GET에 포함된 난이도표 — 없으면 전역 rainbow 맵 */
  difficultyColors?: TGymDifficultyColor[];
}

const RecordRouteRow = ({
  difficulty,
  result,
  attempts,
  onChangeAttempts,
  onRemove,
  difficultyColors,
}: IProps) => {
  const presentation = getDifficultyChipPresentation(
    difficulty,
    difficultyColors,
  );
  const rainbow = getRouteRainbowStyleForDifficulty(difficulty);

  const chipNode =
    presentation.kind === "gym" ? (
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:size-11"
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
          "flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:size-11",
          presentation.rainbow.chipClass,
          presentation.rainbow.gradeTextClass,
        )}
      >
        {difficultyToKoreanMap[difficulty]}
      </div>
    );

  const subLine =
    presentation.kind === "gym"
      ? `시도 ${attempts}회`
      : `${rainbow.labelKo} · 시도 ${attempts}회`;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-outline-variant/35 bg-surface-container-low/80 px-2.5 py-2 sm:gap-3 sm:px-3",
      )}
    >
      {chipNode}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-on-surface">
          {attemptResultToKoreanMap[result]}
        </div>
        <div className="text-xs text-on-surface-variant">{subLine}</div>
      </div>
      <div className="flex items-center gap-0.5 rounded-xl bg-surface-container-high p-0.5">
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-lg text-on-surface hover:bg-surface-container disabled:opacity-40"
          disabled={attempts <= 1}
          onClick={() => onChangeAttempts(Math.max(1, attempts - 1))}
          aria-label="시도 횟수 감소"
        >
          <Minus className="size-4" strokeWidth={2} />
        </button>
        <span className="min-w-7 text-center text-sm font-semibold tabular-nums text-on-surface">
          {attempts}
        </span>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-lg text-on-surface hover:bg-surface-container"
          onClick={() => onChangeAttempts(attempts + 1)}
          aria-label="시도 횟수 증가"
        >
          <Plus className="size-4" strokeWidth={2} />
        </button>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="flex size-9 shrink-0 items-center justify-center rounded-xl text-on-surface-variant hover:bg-destructive/10 hover:text-destructive"
        aria-label="루트 삭제"
      >
        <Trash2 className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
};

export default RecordRouteRow;
