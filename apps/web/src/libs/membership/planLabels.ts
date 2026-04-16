import type { TMembershipPlanCode } from "@clog/contracts";

const LABELS: Record<TMembershipPlanCode, string> = {
  PERIOD_1M: "1개월 정기",
  PERIOD_3M: "3개월 정기",
  PERIOD_6M: "6개월 정기",
  PERIOD_12M: "12개월 정기",
  COUNT_DAY: "일일권(1회)",
  COUNT_3: "횟수권 3회",
  COUNT_5: "횟수권 5회",
  COUNT_10: "횟수권 10회",
};

export const membershipPlanCodeLabel = (code: string): string =>
  LABELS[code as TMembershipPlanCode] ?? code;
