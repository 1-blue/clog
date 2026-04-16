import type { MembershipPlanCode } from "../schemas/enums";

/** 회원권 플랜 코드를 한글로 맵핑 */
export const membershipPlanCodeToKoreanMap: Record<MembershipPlanCode, string> =
  {
    PERIOD_1M: "1개월권",
    PERIOD_3M: "3개월권",
    PERIOD_6M: "6개월권",
    PERIOD_12M: "12개월권",
    COUNT_DAY: "일일권",
    COUNT_3: "3회권",
    COUNT_5: "5회권",
    COUNT_10: "10회권",
  };
