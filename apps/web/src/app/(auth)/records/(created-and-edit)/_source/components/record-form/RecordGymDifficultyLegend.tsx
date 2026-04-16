"use client";

import type { Difficulty } from "@clog/db";

import {
  getDifficultyChipPresentation,
  getDifficultyOrderForForm,
  type TGymDifficultyColor,
} from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";
import { cn } from "#web/libs/utils";

import { recordFormFieldLabelClass } from "../../utils/record-form-ui";

interface IProps {
  difficultyColors: TGymDifficultyColor[] | undefined;
  className?: string;
  /** 미지정 시 폼 필드 라벨 스타일 */
  labelClassName?: string;
}

/** 암장 선택 후 암장 난이도표 범례 (가로 스크롤) */
const RecordGymDifficultyLegend = ({
  difficultyColors,
  className,
  labelClassName = recordFormFieldLabelClass,
}: IProps) => {
  const order = getDifficultyOrderForForm(difficultyColors);
  if (!difficultyColors?.length) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className={labelClassName}>암장 난이도</span>
      <div className="flex flex-wrap gap-x-1.5 gap-y-2.5">
        {order.map((d: Difficulty) => {
          const chip = getDifficultyChipPresentation(d, difficultyColors);

          return (
            <div
              key={d}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-outline-variant/35 bg-surface-container-high/80 px-2.5 py-1 text-xs font-medium text-on-surface"
            >
              {chip.kind === "gym" ? (
                <span
                  className="size-3.5 shrink-0 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: chip.backgroundColor }}
                />
              ) : (
                <span
                  className={cn(
                    "size-3.5 shrink-0 rounded-full",
                    chip.rainbow.chipClass,
                  )}
                />
              )}
              <span className="whitespace-nowrap">{chip.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecordGymDifficultyLegend;
