import { addMonths } from "date-fns";

import {
  COUNT_PASS_VALIDITY_MONTHS,
  initialUsesForCountPlanCode,
  isCountPlanCode,
  isPeriodPlanCode,
  periodMonthsForPlanCode,
  type TMembershipPlanCode,
} from "@clog/contracts";

/** yyyy-MM-dd 문자열을 서울 당일 00:00:00(+09:00) 시각의 Date로 변환 */
export const seoulYmdToDate = (ymd: string): Date =>
  new Date(`${ymd}T00:00:00+09:00`);

/** Date(세션 date 등)을 서울 기준 yyyy-MM-dd */
export const toSeoulYmd = (d: Date): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${day}`;
};

/** 양끝 포함 일수 (같은 날이면 1) */
export const inclusiveDayCount = (startYmd: string, endYmd: string): number => {
  const s = seoulYmdToDate(startYmd).getTime();
  const e = seoulYmdToDate(endYmd).getTime();
  const diff = Math.round((e - s) / 86_400_000);
  return diff >= 0 ? diff + 1 : 0;
};

export interface IMembershipPauseRow {
  startDate: Date;
  endDate: Date;
}

/** 일시정지로 연장되는 총 일수(각 구간 양끝 포함 합) */
export const totalPauseExtensionDays = (
  pauses: IMembershipPauseRow[],
): number => {
  let n = 0;
  for (const p of pauses) {
    const sy = toSeoulYmd(p.startDate);
    const ey = toSeoulYmd(p.endDate);
    n += inclusiveDayCount(sy, ey);
  }
  return n;
};

/** 기본 종료 시각: 마지막 유효일의 서울 23:59:59.999 에 해당하는 UTC (비교용) */
const endOfLastValidDayUtc = (lastValidYmd: string): Date => {
  const start = seoulYmdToDate(lastValidYmd);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
};

/**
 * 유효 기간 [startedAt, effectiveEnd] (방문일 date가 이 안이면 OK)
 * - 정기: 시작 + N개월 + 일시정지 일수(일 단위 연장)
 * - 횟수: 시작 + 12개월 + 일시정지 일수
 */
export const computeMembershipValidity = (input: {
  planCode: TMembershipPlanCode;
  startedAt: Date;
  pauses: IMembershipPauseRow[];
}): { effectiveEndAt: Date; lastValidYmd: string } => {
  const { planCode, startedAt, pauses } = input;
  const extDays = totalPauseExtensionDays(pauses);

  let baseEnd: Date;
  if (isPeriodPlanCode(planCode)) {
    const months = periodMonthsForPlanCode(planCode);
    if (months == null) {
      throw new Error("periodMonthsForPlanCode mismatch");
    }
    baseEnd = addMonths(startedAt, months);
  } else if (isCountPlanCode(planCode)) {
    baseEnd = addMonths(startedAt, COUNT_PASS_VALIDITY_MONTHS);
  } else {
    throw new Error(`unknown plan code: ${planCode}`);
  }

  if (extDays > 0) {
    baseEnd = new Date(baseEnd.getTime() + extDays * 86_400_000);
  }

  const lastValidYmd = toSeoulYmd(new Date(baseEnd.getTime() - 1));
  const effectiveEndAt = endOfLastValidDayUtc(lastValidYmd);
  return { effectiveEndAt, lastValidYmd };
};

/** 방문일(세션 date)이 회원권 유효 기간 안인지 */
export const isSessionDateWithinMembership = (input: {
  sessionDate: Date;
  startedAt: Date;
  planCode: TMembershipPlanCode;
  pauses: IMembershipPauseRow[];
}): boolean => {
  const { effectiveEndAt } = computeMembershipValidity({
    planCode: input.planCode,
    startedAt: input.startedAt,
    pauses: input.pauses,
  });
  const d = input.sessionDate;
  return (
    d.getTime() >= input.startedAt.getTime() &&
    d.getTime() <= effectiveEndAt.getTime()
  );
};

export const initialRemainingUsesForPlan = (
  code: TMembershipPlanCode,
): number | null => initialUsesForCountPlanCode(code);
