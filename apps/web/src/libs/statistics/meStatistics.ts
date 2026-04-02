import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  max,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { ko } from "date-fns/locale";

import type { ClimbingAttemptResult } from "@clog/db";

/** @see meStatisticsQuerySchema period */
export type TMeStatisticsPeriod = "week" | "month" | "year" | "all";

const WEEK_OPTS = { weekStartsOn: 1 as const }; // 월요일 시작

/** 통계·히트맵 등 서비스 데이터 시작일 (이전 기간은 없음) */
export const STATISTICS_DATA_START = startOfDay(new Date(2026, 0, 1));

export type TDateRange = {
  start: Date;
  end: Date;
};

/** 현재 기간 조회용: 시작을 데이터 시작일 이후로 맞춤 */
export const clipStatisticsRange = (range: TDateRange): TDateRange => {
  if (range.end < STATISTICS_DATA_START) {
    return { start: STATISTICS_DATA_START, end: STATISTICS_DATA_START };
  }
  const start =
    range.start < STATISTICS_DATA_START ? STATISTICS_DATA_START : range.start;
  return { start, end: range.end };
};

/** 이전 기간 비교: 구간 전체가 데이터 시작 이전이면 비교 없음 */
export const clipPreviousStatisticsRangeIfValid = (
  range: TDateRange,
): TDateRange | null => {
  if (range.end < STATISTICS_DATA_START) return null;
  const start =
    range.start < STATISTICS_DATA_START ? STATISTICS_DATA_START : range.start;
  if (start > range.end) return null;
  return { start, end: range.end };
};

/** V0 -> 0 … V10 -> 10 */
export const difficultyToLevel = (d: string): number =>
  Number.parseInt(d.replace("V", ""), 10);

export const isSendLike = (r: ClimbingAttemptResult): boolean =>
  r !== "ATTEMPT";

/** anchorDate 파싱 (yyyy-MM-dd). 데이터 시작 이전은 시작일로 맞춤 */
export const parseAnchor = (anchor?: string): Date => {
  const d = anchor ? parseISO(anchor) : new Date();
  return max([d, STATISTICS_DATA_START]);
};

/**
 * period + anchor 로 현재 구간 [start, end] (end는 해당 일자 끝)
 * all: 첫 세션일 ~ anchor 일 끝 (세션 없으면 anchor 하루)
 */
export const resolveStatisticsRange = async (params: {
  period: TMeStatisticsPeriod;
  anchor: Date;
  firstSessionDate: Date | null;
}): Promise<TDateRange> => {
  const { period, anchor, firstSessionDate } = params;

  if (period === "all") {
    const end = endOfDay(anchor);
    if (!firstSessionDate) {
      return clipStatisticsRange({ start: startOfDay(anchor), end });
    }
    return clipStatisticsRange({
      start: startOfDay(firstSessionDate),
      end,
    });
  }

  if (period === "week") {
    return clipStatisticsRange({
      start: startOfDay(startOfWeek(anchor, WEEK_OPTS)),
      end: endOfDay(endOfWeek(anchor, WEEK_OPTS)),
    });
  }

  if (period === "month") {
    return clipStatisticsRange({
      start: startOfDay(startOfMonth(anchor)),
      end: endOfDay(endOfMonth(anchor)),
    });
  }

  return clipStatisticsRange({
    start: startOfDay(startOfYear(anchor)),
    end: endOfDay(endOfYear(anchor)),
  });
};

/** 기간 라벨·네비 표시용 (세션 조회 없이 동기). all 은 데이터 시작일 ~ anchor */
export const resolveStatisticsRangeSync = (
  period: TMeStatisticsPeriod,
  anchor: Date,
): TDateRange => {
  if (period === "all") {
    return clipStatisticsRange({
      start: STATISTICS_DATA_START,
      end: endOfDay(anchor),
    });
  }
  if (period === "week") {
    return clipStatisticsRange({
      start: startOfDay(startOfWeek(anchor, WEEK_OPTS)),
      end: endOfDay(endOfWeek(anchor, WEEK_OPTS)),
    });
  }
  if (period === "month") {
    return clipStatisticsRange({
      start: startOfDay(startOfMonth(anchor)),
      end: endOfDay(endOfMonth(anchor)),
    });
  }
  return clipStatisticsRange({
    start: startOfDay(startOfYear(anchor)),
    end: endOfDay(endOfYear(anchor)),
  });
};

/** 동일 길이 직전 구간 (비교·증감률용). all 은 null */
export const resolvePreviousStatisticsRange = (params: {
  period: TMeStatisticsPeriod;
  anchor: Date;
  current: TDateRange;
}): TDateRange | null => {
  const { period, anchor } = params;

  if (period === "all") return null;

  if (period === "week") {
    const prevAnchor = subWeeks(anchor, 1);
    return clipPreviousStatisticsRangeIfValid({
      start: startOfDay(startOfWeek(prevAnchor, WEEK_OPTS)),
      end: endOfDay(endOfWeek(prevAnchor, WEEK_OPTS)),
    });
  }

  if (period === "month") {
    const prevAnchor = subMonths(anchor, 1);
    return clipPreviousStatisticsRangeIfValid({
      start: startOfDay(startOfMonth(prevAnchor)),
      end: endOfDay(endOfMonth(prevAnchor)),
    });
  }

  const prevAnchor = subYears(anchor, 1);
  return clipPreviousStatisticsRangeIfValid({
    start: startOfDay(startOfYear(prevAnchor)),
    end: endOfDay(endOfYear(prevAnchor)),
  });
};

/** 단일 일자: "3월 15일" (연도가 다르면 연도 포함) */
const formatMonthDayKo = (d: Date, withYear: boolean): string =>
  withYear
    ? format(d, "yyyy년 M월 d일", { locale: ko })
    : format(d, "M월 d일", { locale: ko });

/** UI 표시용 범위 라벨 (통계: x월 x일 형식 우선) */
export const formatRangeLabel = (
  period: TMeStatisticsPeriod,
  start: Date,
  end: Date,
): string => {
  if (period === "month") {
    return format(start, "yyyy년 M월", { locale: ko });
  }
  if (period === "year") {
    return format(start, "yyyy년", { locale: ko });
  }

  const sameYear = start.getFullYear() === end.getFullYear();
  const left = formatMonthDayKo(start, !sameYear);
  const right = formatMonthDayKo(end, !sameYear);
  return `${left} - ${right}`;
};

export type TTrendBucket = { key: string; sends: number; label: string };

/** 활동 추세 버킷 (주·월: 일, 년: 월, 전체: 월) */
export const buildTrendBuckets = (
  period: TMeStatisticsPeriod,
  range: TDateRange,
  sendsByKey: Map<string, number>,
): TTrendBucket[] => {
  if (period === "year") {
    const months = eachMonthOfInterval({
      start: startOfMonth(range.start),
      end: endOfMonth(range.end),
    });
    return months.map((d) => {
      const key = format(d, "yyyy-MM");
      return {
        key,
        sends: sendsByKey.get(key) ?? 0,
        label: format(d, "yyyy년 M월", { locale: ko }),
      };
    });
  }

  if (period === "all") {
    const months = eachMonthOfInterval({
      start: startOfMonth(range.start),
      end: endOfMonth(range.end),
    });
    return months.map((d) => {
      const key = format(d, "yyyy-MM");
      return {
        key,
        sends: sendsByKey.get(key) ?? 0,
        label: format(d, "yyyy년 M월", { locale: ko }),
      };
    });
  }

  const days = eachDayOfInterval({ start: range.start, end: range.end });
  return days.map((d) => {
    const key = format(d, "yyyy-MM-dd");
    return {
      key,
      sends: sendsByKey.get(key) ?? 0,
      label: format(d, "M월 d일", { locale: ko }),
    };
  });
};
