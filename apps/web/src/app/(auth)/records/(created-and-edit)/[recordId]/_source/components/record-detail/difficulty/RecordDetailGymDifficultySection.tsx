"use client";

import RecordGymDifficultyLegend from "#web/app/(auth)/records/(created-and-edit)/_source/components/record-form/RecordGymDifficultyLegend";
import type { TGymDifficultyColor } from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";
import { cn } from "#web/libs/utils";

interface IProps {
  difficultyColors: TGymDifficultyColor[] | undefined;
  className?: string;
}

/** 기록 상세용 암장 난이도 범례 (색 데이터 없을 때 안내) */
const RecordDetailGymDifficultySection: React.FC<IProps> = ({
  difficultyColors,
  className,
}) => {
  if (!difficultyColors?.length) {
    return (
      <p className={cn("text-sm text-on-surface-variant", className)}>
        이 암장은 아직 난이도 색 표기가 등록되지 않았어요. 공통 색 기준으로
        표시돼요.
      </p>
    );
  }

  return (
    <RecordGymDifficultyLegend
      difficultyColors={difficultyColors}
      labelClassName="text-sm font-bold text-on-surface"
      className={className}
    />
  );
};

export default RecordDetailGymDifficultySection;
