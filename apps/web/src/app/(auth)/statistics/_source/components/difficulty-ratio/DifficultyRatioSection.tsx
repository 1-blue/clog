"use client";

import type { components } from "#web/@types/openapi";

import DifficultyBarChart from "./DifficultyBarChart";
import SendAttemptChart from "./SendAttemptChart";

type TPayload = components["schemas"]["MeStatisticsPayload"];

interface IProps {
  data: TPayload;
}

const DifficultyRatioSection: React.FC<IProps> = ({ data }) => {
  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="space-y-3 rounded-2xl bg-surface-container-low p-4">
        <h3 className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
          난이도 분포
        </h3>
        <DifficultyBarChart rows={data.difficultyDistribution} />
      </div>
      <div className="flex flex-col rounded-2xl bg-surface-container-low p-4">
        <h3 className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
          완등/시도 비율
        </h3>
        <div className="flex flex-1 flex-col items-center justify-center pt-2">
          <SendAttemptChart sendAttempt={data.sendAttempt} />
        </div>
      </div>
    </section>
  );
};

export default DifficultyRatioSection;
