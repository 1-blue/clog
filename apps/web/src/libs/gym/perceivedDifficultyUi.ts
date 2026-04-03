import type { components } from "#web/@types/openapi";

export type TGymPerceivedDifficulty =
  components["schemas"]["GymPerceivedDifficulty"];

/** 평균 바 아래 축 라벨 (5단계) */
export const perceivedDifficultyAxisLabels: {
  key: TGymPerceivedDifficulty;
  short: string;
}[] = [
  { key: "EASY", short: "쉬움" },
  { key: "EASY_NORMAL", short: "쉬움~보통" },
  { key: "NORMAL", short: "보통" },
  { key: "NORMAL_HARD", short: "보통~어려움" },
  { key: "HARD", short: "어려움" },
];
