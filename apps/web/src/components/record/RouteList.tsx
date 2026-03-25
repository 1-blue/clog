"use client";

import { X } from "lucide-react";
import React from "react";

import {
  attemptResultToKoreanMap,
  type AttemptResult,
  type Difficulty,
} from "@clog/utils";

import DifficultyChip from "#web/components/record/DifficultyChip";

interface IRouteEntry {
  difficulty: Difficulty;
  result: AttemptResult;
  attempts: number;
}

interface IProps {
  routes: IRouteEntry[];
  onRemoveRoute: (index: number) => void;
  /** 라벨 텍스트 (기본: "추가된 루트") */
  label?: string;
}

const RouteList: React.FC<IProps> = ({
  routes,
  onRemoveRoute,
  label = "추가된 루트",
}) => {
  if (routes.length === 0) return null;

  return (
    <div>
      <label className="text-sm font-medium text-on-surface">
        {label} ({routes.length})
      </label>
      <div className="mt-2 space-y-2">
        {routes.map((route, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl bg-surface-container-low p-3"
          >
            <div className="flex items-center gap-2">
              <DifficultyChip difficulty={route.difficulty} size="md" />
              <span className="text-sm text-on-surface">
                {attemptResultToKoreanMap[route.result]}
              </span>
            </div>
            <button
              onClick={() => onRemoveRoute(i)}
              className="text-on-surface-variant hover:text-destructive"
            >
              <X className="size-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RouteList;
