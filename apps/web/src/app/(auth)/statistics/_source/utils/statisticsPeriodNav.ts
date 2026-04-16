import {
  addMonths,
  addWeeks,
  addYears,
  format,
  isAfter,
  isBefore,
  max,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

import type { TStatisticsPeriod } from "@clog/contracts";

import { STATISTICS_DATA_START } from "#web/libs/statistics/meStatistics";

const WEEK_OPTS = { weekStartsOn: 1 as const };

export const formatAnchorParam = (d: Date): string => format(d, "yyyy-MM-dd");

export const shiftAnchor = (
  period: TStatisticsPeriod,
  anchor: Date,
  delta: -1 | 1,
): Date => {
  if (period === "all") return anchor;
  if (period === "week") {
    return delta > 0 ? addWeeks(anchor, 1) : subWeeks(anchor, 1);
  }
  if (period === "month") {
    return delta > 0 ? addMonths(anchor, 1) : subMonths(anchor, 1);
  }
  return delta > 0 ? addYears(anchor, 1) : subYears(anchor, 1);
};

export const defaultAnchor = (): Date =>
  max([startOfDay(new Date()), STATISTICS_DATA_START]);

/** 이전 기간으로 이동 가능한지 (데이터 시작 이전 주·월·년으로는 이동 불가) */
export const canShiftStatisticsPrev = (
  period: TStatisticsPeriod,
  anchor: Date,
): boolean => {
  if (period === "all") return false;
  const shifted = shiftAnchor(period, anchor, -1);
  if (period === "week") {
    return !isBefore(
      startOfWeek(shifted, WEEK_OPTS),
      startOfWeek(STATISTICS_DATA_START, WEEK_OPTS),
    );
  }
  if (period === "month") {
    return !isBefore(
      startOfMonth(shifted),
      startOfMonth(STATISTICS_DATA_START),
    );
  }
  return !isBefore(startOfYear(shifted), startOfYear(STATISTICS_DATA_START));
};

/** 다음 기간으로 이동 가능한지 (미래 주·월·년으로는 이동 불가) */
export const canShiftStatisticsNext = (
  period: TStatisticsPeriod,
  anchor: Date,
): boolean => {
  if (period === "all") return false;
  const shifted = shiftAnchor(period, anchor, 1);
  const now = new Date();
  if (period === "week") {
    return !isAfter(
      startOfWeek(shifted, WEEK_OPTS),
      startOfWeek(now, WEEK_OPTS),
    );
  }
  if (period === "month") {
    return !isAfter(startOfMonth(shifted), startOfMonth(now));
  }
  return !isAfter(startOfYear(shifted), startOfYear(now));
};
