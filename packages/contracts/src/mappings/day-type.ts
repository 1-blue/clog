import type { DayType } from "../schemas/enums";

/** 요일을 한글로 맵핑 */
export const dayTypeToKoreanMap: Record<DayType, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};
