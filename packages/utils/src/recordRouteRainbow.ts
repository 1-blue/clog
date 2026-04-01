import type { Difficulty } from "./schemas/enums";

/**
 * 난이도(V0→V1→…) 순서와 1:1 매핑.
 * V0=빨, V1=주, V2=노, V3=연두, V4=초, V5=파, V6=남, V7=보, V8=핑크, V9=흰, V10=검
 */
export const DIFFICULTY_RAINBOW_ORDER: readonly Difficulty[] = [
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
];

/**
 * 루트 목록에서의 인덱스(0,1,2…)로 난이도별 스타일 — 행 번호용.
 * V0=빨 → V1=주 → V2=노 → V3=연두 → V4=초 → V5=파 → V6=남 → V7=보 → V8=핑크 → V9=흰 → V10=검
 */
export interface IRouteRainbowStyle {
  /** 난이도 원형 배경 + 테두리 */
  chipClass: string;
  /** 난이도 텍스트 */
  gradeTextClass: string;
  /** 보조 라벨 (한글 색 이름) */
  labelKo: string;
}

const RAINBOW: IRouteRainbowStyle[] = [
  {
    chipClass: "bg-red-500/20 ring-1 ring-red-500/35",
    gradeTextClass: "text-red-400",
    labelKo: "빨강",
  },
  {
    chipClass: "bg-orange-500/20 ring-1 ring-orange-500/35",
    gradeTextClass: "text-orange-400",
    labelKo: "주황",
  },
  {
    chipClass: "bg-yellow-500/20 ring-1 ring-yellow-500/35",
    gradeTextClass: "text-yellow-400",
    labelKo: "노랑",
  },
  {
    chipClass: "bg-lime-500/20 ring-1 ring-lime-500/35",
    gradeTextClass: "text-lime-400",
    labelKo: "연두",
  },
  {
    chipClass: "bg-green-500/20 ring-1 ring-green-500/35",
    gradeTextClass: "text-green-400",
    labelKo: "초록",
  },
  {
    chipClass: "bg-blue-500/20 ring-1 ring-blue-500/35",
    gradeTextClass: "text-blue-400",
    labelKo: "파랑",
  },
  {
    chipClass: "bg-indigo-500/20 ring-1 ring-indigo-500/35",
    gradeTextClass: "text-indigo-400",
    labelKo: "남색",
  },
  {
    chipClass: "bg-purple-500/20 ring-1 ring-purple-500/35",
    gradeTextClass: "text-purple-400",
    labelKo: "보라",
  },
  {
    chipClass: "bg-pink-500/20 ring-1 ring-pink-500/35",
    gradeTextClass: "text-pink-400",
    labelKo: "핑크",
  },
  {
    chipClass: "bg-neutral-300/20 ring-1 ring-neutral-300/35",
    gradeTextClass: "text-neutral-200",
    labelKo: "흰색",
  },
  {
    chipClass: "bg-neutral-900/40 ring-1 ring-neutral-700/35",
    gradeTextClass: "text-neutral-100",
    labelKo: "검정",
  },
];

export const ROUTE_RAINBOW_LENGTH = RAINBOW.length;

export const getRouteRainbowStyle = (routeIndex: number): IRouteRainbowStyle => {
  const i =
    ((routeIndex % ROUTE_RAINBOW_LENGTH) + ROUTE_RAINBOW_LENGTH) %
    ROUTE_RAINBOW_LENGTH;
  return RAINBOW[i]!;
};

/** 난이도에 따른 무지개 (V0 빨강, V1 주황, …) */
export const getRouteRainbowStyleForDifficulty = (
  difficulty: Difficulty,
): IRouteRainbowStyle => {
  const idx = DIFFICULTY_RAINBOW_ORDER.indexOf(difficulty);
  return getRouteRainbowStyle(idx >= 0 ? idx : 0);
};
