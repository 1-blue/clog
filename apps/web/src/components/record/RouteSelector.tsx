"use client";

import { Plus } from "lucide-react";
import React from "react";

import {
  attemptResultToKoreanMap,
  difficultyToKoreanMap,
  type AttemptResult,
  type Difficulty,
} from "@clog/utils";

const DIFFICULTIES = Object.keys(difficultyToKoreanMap) as Difficulty[];
const RESULTS = Object.entries(attemptResultToKoreanMap) as [AttemptResult, string][];

interface IProps {
  selectedDifficulty: Difficulty;
  setSelectedDifficulty: (d: Difficulty) => void;
  selectedResult: AttemptResult;
  setSelectedResult: (r: AttemptResult) => void;
  onAddRoute: () => void;
}

const RouteSelector: React.FC<IProps> = ({
  selectedDifficulty,
  setSelectedDifficulty,
  selectedResult,
  setSelectedResult,
  onAddRoute,
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-on-surface">루트 추가</label>

      {/* 난이도 선택 */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDifficulty(d)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedDifficulty === d
                ? "bg-primary text-primary-foreground"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            {difficultyToKoreanMap[d]}
          </button>
        ))}
      </div>

      {/* 결과 선택 */}
      <div className="mt-2 flex gap-2">
        {RESULTS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedResult(key)}
            className={`flex-1 rounded-xl py-2 text-xs font-medium transition-colors ${
              selectedResult === key
                ? "bg-secondary text-secondary-foreground"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={onAddRoute}
        className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-outline-variant py-3 text-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-4" />
        루트 추가
      </button>
    </div>
  );
};
export default RouteSelector;
