"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import {
  attemptResultToKoreanMap,
  difficultyToKoreanMap,
  type AttemptResult,
  type Difficulty,
} from "@clog/utils";

import { Button } from "#web/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "#web/components/ui/sheet";
import { cn } from "#web/libs/utils";

import type { IRecordNewRouteEntry } from "./record-new-types";

const DIFFICULTIES = Object.keys(difficultyToKoreanMap) as Difficulty[];
const RESULTS = Object.entries(attemptResultToKoreanMap) as [AttemptResult, string][];

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (entry: IRecordNewRouteEntry) => void;
}

const RecordRouteAddSheet = ({ open, onOpenChange, onAdd }: IProps) => {
  const [difficulty, setDifficulty] = useState<Difficulty>("V3");
  const [result, setResult] = useState<AttemptResult>("SEND");

  const handleAdd = () => {
    onAdd({ difficulty, result, attempts: 1 });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-dvh overflow-y-auto rounded-t-3xl border-t border-outline-variant bg-surface-container"
        showCloseButton
      >
        <div className="px-5 pb-6">
          <SheetHeader className="text-left px-0 pt-1 pb-3">
            <SheetTitle className="text-on-surface">난이도 추가</SheetTitle>
            <p className="text-sm font-normal text-on-surface-variant">
              이번 세션에 올린 루트를 골라주세요
            </p>
          </SheetHeader>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold tracking-wider text-outline uppercase">
                난이도
              </p>
              <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                      difficulty === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-container-high text-on-surface-variant hover:text-on-surface",
                    )}
                  >
                    {difficultyToKoreanMap[d]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold tracking-wider text-outline uppercase">
                결과
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {RESULTS.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setResult(key)}
                    className={cn(
                      "rounded-xl py-2.5 text-xs font-semibold transition-colors",
                      result === key
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-surface-container-high text-on-surface-variant hover:text-on-surface",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              className="h-12 w-full rounded-2xl gap-2 text-base font-bold"
              onClick={handleAdd}
            >
              <Plus className="size-5" strokeWidth={2} />
              루트에 추가
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RecordRouteAddSheet;
