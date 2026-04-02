"use client";

import { CalendarDays, Clock, MapPin, Mountain } from "lucide-react";

import type { components } from "#web/@types/openapi";

import KpiSummaryCard from "./KpiSummaryCard";

type TPayload = components["schemas"]["MeStatisticsPayload"];

const formatWorkoutMinutes = (total: number | null): string => {
  if (total === null) return "—";
  if (total < 60) return `${total}분`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}분`;
};

interface IProps {
  data: TPayload;
}

const KpiSummaryGrid: React.FC<IProps> = ({ data }) => {
  const { kpis, sendAttempt } = data;
  const totalRoutes = sendAttempt.totalRoutes;
  const sendRouteCount = sendAttempt.sendCount;
  const completionValue =
    totalRoutes === 0 ? "—" : `${sendRouteCount}/${totalRoutes}`;

  return (
    <section className="grid grid-cols-2 gap-4">
      <KpiSummaryCard
        icon={Mountain}
        label="총 완등"
        value={completionValue}
        successRatePercent={
          totalRoutes === 0 || sendAttempt.percent === null
            ? null
            : sendAttempt.percent
        }
      />
      <KpiSummaryCard
        icon={MapPin}
        label="방문 암장"
        value={String(kpis.uniqueGyms)}
      />
      <KpiSummaryCard
        icon={CalendarDays}
        label="총 세션"
        value={String(kpis.sessionCount)}
      />
      <KpiSummaryCard
        icon={Clock}
        label="운동 시간"
        value={formatWorkoutMinutes(kpis.workoutMinutesTotal)}
      />
    </section>
  );
};

export default KpiSummaryGrid;
