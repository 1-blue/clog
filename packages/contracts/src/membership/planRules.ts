/** Prisma `MembershipPlanCode`와 동일한 문자열 유니온 */
export const MEMBERSHIP_PLAN_CODES = [
  "PERIOD_1M",
  "PERIOD_3M",
  "PERIOD_6M",
  "PERIOD_12M",
  "COUNT_DAY",
  "COUNT_3",
  "COUNT_5",
  "COUNT_10",
] as const;

export type TMembershipPlanCode = (typeof MEMBERSHIP_PLAN_CODES)[number];

/** 횟수권 유효 기간(시작일 기준 개월 수, 일시정지 시 종료일 연장) */
export const COUNT_PASS_VALIDITY_MONTHS = 12;

export const isPeriodPlanCode = (code: string): boolean =>
  code.startsWith("PERIOD_");

export const isCountPlanCode = (code: string): boolean =>
  code.startsWith("COUNT_");

/** 정기권: 시작일 기준 가입 기간(월). 횟수권이면 null */
export const periodMonthsForPlanCode = (
  code: TMembershipPlanCode,
): number | null => {
  switch (code) {
    case "PERIOD_1M":
      return 1;
    case "PERIOD_3M":
      return 3;
    case "PERIOD_6M":
      return 6;
    case "PERIOD_12M":
      return 12;
    default:
      return null;
  }
};

/** 횟수권 최초 부여 횟수. 정기권이면 null */
export const initialUsesForCountPlanCode = (
  code: TMembershipPlanCode,
): number | null => {
  switch (code) {
    case "COUNT_DAY":
      return 1;
    case "COUNT_3":
      return 3;
    case "COUNT_5":
      return 5;
    case "COUNT_10":
      return 10;
    default:
      return null;
  }
};
