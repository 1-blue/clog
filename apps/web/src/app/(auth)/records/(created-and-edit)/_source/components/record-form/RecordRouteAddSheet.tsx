"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import {
  attemptResultToKoreanMap,
  type AttemptResult,
  type Difficulty,
} from "@clog/contracts";

import type { IRecordSessionRouteEntry } from "#web/app/(auth)/records/(created-and-edit)/_source/types/record-session-types";
import {
  getDifficultyLabelForGym,
  getDifficultyOrderForForm,
  type TGymDifficultyColor,
} from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";
import { Badge, badgeVariants } from "#web/components/ui/badge";
import { Button } from "#web/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "#web/components/ui/sheet";
import { cn } from "#web/libs/utils";

import { recordFormFieldLabelClass } from "../../utils/record-form-ui";

const RESULTS = Object.entries(attemptResultToKoreanMap) as [
  AttemptResult,
  string,
][];

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (entry: IRecordSessionRouteEntry) => void;
  difficultyColors?: TGymDifficultyColor[];
}

const RecordRouteAddSheet: React.FC<IProps> = ({
  open,
  onOpenChange,
  onAdd,
  difficultyColors,
}) => {
  const order = getDifficultyOrderForForm(difficultyColors);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    () => (order[0] ?? "V3") as Difficulty,
  );
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
        <div className="flex flex-col gap-4 px-2.5 pb-6">
          <SheetHeader className="px-0 pb-0 text-left">
            <SheetTitle className="text-on-surface">난이도 추가</SheetTitle>
            <p className="text-sm font-normal text-on-surface-variant">
              이번 세션에 올린 루트를 골라주세요
            </p>
          </SheetHeader>

          <div className="flex flex-col gap-1 text-xs leading-relaxed text-on-surface-variant">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="align-middle text-[10px]">
                플래시
              </Badge>
              <p>홀드·동선을 미리 알고 있을 때 첫 시도로 완등한 경우예요.</p>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="align-middle text-[10px]">
                온사이트
              </Badge>
              <p>문제 정보를 모른 채 첫 시도로 완등한 경우예요.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <p className={recordFormFieldLabelClass}>난이도</p>
              <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {order.map((d) => {
                  const label = getDifficultyLabelForGym(d, difficultyColors);
                  const row = difficultyColors?.find((c) => c.difficulty === d);
                  const selected = difficulty === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        badgeVariants({
                          variant: selected ? "default" : "outline",
                        }),
                        "h-auto min-h-7 shrink-0 gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors",
                        !selected &&
                          "border-border bg-surface-container-high/90 text-on-surface hover:bg-surface-container-high",
                      )}
                    >
                      <span
                        className={cn(
                          "size-3.5 shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/15",
                          !row?.color && "bg-on-surface-variant/45",
                        )}
                        style={
                          row?.color
                            ? { backgroundColor: row.color }
                            : undefined
                        }
                        aria-hidden
                      />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className={recordFormFieldLabelClass}>결과</p>
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
              className="h-12 w-full gap-2 rounded-2xl text-base font-bold"
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
