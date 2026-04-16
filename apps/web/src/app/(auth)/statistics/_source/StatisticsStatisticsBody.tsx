"use client";

import type { TStatisticsPeriod } from "@clog/contracts";

import { openapi } from "#web/apis/openapi";

import ActivityTrendSection from "./components/activity-trend/ActivityTrendSection";
import DifficultyRatioSection from "./components/difficulty-ratio/DifficultyRatioSection";
import StatisticsEmpty from "./components/empty-state/StatisticsEmpty";
import FrequentGymsSection from "./components/frequent-gyms/FrequentGymsSection";
import InsightsSection from "./components/insights/InsightsSection";
import KpiSummaryGrid from "./components/kpi-summary/KpiSummaryGrid";

interface IProps {
  period: TStatisticsPeriod;
  anchorStr: string;
}

const StatisticsStatisticsBody: React.FC<IProps> = ({ period, anchorStr }) => {
  const { data } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/users/me/statistics",
    {
      params: {
        query: {
          period,
          anchor: anchorStr,
        },
      },
    },
    {
      staleTime: 30_000,
    },
  );

  const payload = data?.payload;
  if (!payload) {
    return null;
  }

  const isEmpty =
    payload.kpis.sessionCount === 0 && payload.sendAttempt.totalRoutes === 0;

  if (isEmpty) {
    return <StatisticsEmpty />;
  }

  return (
    <>
      <KpiSummaryGrid data={payload} />
      <ActivityTrendSection data={payload} />
      <DifficultyRatioSection data={payload} />
      <FrequentGymsSection data={payload} />
      <InsightsSection data={payload} />
    </>
  );
};

export default StatisticsStatisticsBody;
