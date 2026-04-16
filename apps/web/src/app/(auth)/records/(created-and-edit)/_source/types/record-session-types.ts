import type { AttemptResult, Difficulty } from "@clog/contracts";

/** 기록 추가·수정 폼에서 공통으로 쓰는 루트 한 줄 */
export interface IRecordSessionRouteEntry {
  difficulty: Difficulty;
  result: AttemptResult;
  attempts: number;
}
