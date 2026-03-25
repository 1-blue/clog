import type { PerceivedDifficulty } from "../schemas/enums";

/** 체감 난이도를 한글로 맵핑 */
export const perceivedDifficultyToKoreanMap: Record<
  PerceivedDifficulty,
  string
> = {
  EASY: "쉬움",
  NORMAL: "보통",
  HARD: "어려움",
};
