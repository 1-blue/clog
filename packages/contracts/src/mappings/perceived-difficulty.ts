import type { PerceivedDifficulty } from "../schemas/enums";

/** 체감 난이도를 한글로 맵핑 */
export const perceivedDifficultyToKoreanMap: Record<
  PerceivedDifficulty,
  string
> = {
  EASY: "쉬움",
  EASY_NORMAL: "쉬움~보통",
  NORMAL: "보통",
  NORMAL_HARD: "보통~어려움",
  HARD: "어려움",
};
