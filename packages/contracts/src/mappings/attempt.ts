import type { AttemptResult } from "../schemas/enums";

/** 시도 결과를 한글로 맵핑 */
export const attemptResultToKoreanMap: Record<AttemptResult, string> = {
  SEND: "완등",
  ATTEMPT: "시도",
  FLASH: "플래시",
  ONSIGHT: "온사이트",
};
