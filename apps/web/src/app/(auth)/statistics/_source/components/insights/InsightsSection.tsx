"use client";

import type { components } from "#web/@types/openapi";

import InsightCard from "./InsightCard";

type TPayload = components["schemas"]["MeStatisticsPayload"];

interface IProps {
  data: TPayload;
}

const InsightsSection: React.FC<IProps> = ({ data }) => {
  if (data.insights.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="px-1 text-lg font-semibold tracking-tight text-on-surface">
        인사이트
      </h2>
      <div className="space-y-3">
        {data.insights.map((ins, i) => (
          <InsightCard
            key={`${ins.variant}-${i}`}
            variant={ins.variant}
            message={ins.message}
          />
        ))}
      </div>
    </section>
  );
};

export default InsightsSection;
