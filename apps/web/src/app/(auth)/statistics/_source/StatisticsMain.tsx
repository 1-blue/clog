"use client";

import { Suspense, useCallback, useMemo, useState } from "react";

import type { TStatisticsPeriod } from "@clog/utils";

import {
  formatRangeLabel,
  resolveStatisticsRangeSync,
} from "#web/libs/statistics/meStatistics";

import PeriodControl from "./components/period-control/PeriodControl";
import StatisticsSkeleton from "./components/skeleton/StatisticsSkeleton";
import StatisticsStatisticsBody from "./StatisticsStatisticsBody";
import {
  canShiftStatisticsNext,
  canShiftStatisticsPrev,
  defaultAnchor,
  formatAnchorParam,
} from "./utils/statisticsPeriodNav";

const StatisticsMain: React.FC = () => {
  const [period, setPeriod] = useState<TStatisticsPeriod>("week");
  const [anchor, setAnchor] = useState<Date>(defaultAnchor);

  const anchorStr = formatAnchorParam(anchor);

  const rangeLabel = useMemo(() => {
    const r = resolveStatisticsRangeSync(period, anchor);
    return formatRangeLabel(period, r.start, r.end);
  }, [period, anchor]);

  const onPeriodChange = useCallback((p: TStatisticsPeriod) => {
    setPeriod(p);
    setAnchor(defaultAnchor());
  }, []);

  const canGoPrev = canShiftStatisticsPrev(period, anchor);
  const canGoNext = canShiftStatisticsNext(period, anchor);

  return (
    <div className="space-y-8 pb-4">
      <PeriodControl
        period={period}
        onPeriodChange={onPeriodChange}
        anchor={anchor}
        onAnchorChange={setAnchor}
        rangeLabel={rangeLabel}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />

      <Suspense fallback={<StatisticsSkeleton />}>
        <StatisticsStatisticsBody period={period} anchorStr={anchorStr} />
      </Suspense>
    </div>
  );
};

export default StatisticsMain;
