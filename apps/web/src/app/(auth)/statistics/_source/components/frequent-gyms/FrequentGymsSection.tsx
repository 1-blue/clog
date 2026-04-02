"use client";

import type { components } from "#web/@types/openapi";

import FrequentGymRow from "./FrequentGymRow";

type TPayload = components["schemas"]["MeStatisticsPayload"];

interface IProps {
  data: TPayload;
}

const FrequentGymsSection: React.FC<IProps> = ({ data }) => {
  if (data.topGyms.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="px-1 text-lg font-semibold tracking-tight text-on-surface">
          자주 간 암장
        </h2>
        <p className="rounded-2xl bg-surface-container-low px-4 py-8 text-center text-sm text-on-surface-variant">
          이 기간에 방문한 암장이 없어요
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="px-1 text-lg font-semibold tracking-tight text-on-surface">
        자주 간 암장
      </h2>
      <div className="space-y-3">
        {data.topGyms.map((g) => (
          <FrequentGymRow key={g.gymId} gym={g} />
        ))}
      </div>
    </section>
  );
};

export default FrequentGymsSection;
