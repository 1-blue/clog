import type { components } from "#web/@types/openapi";
import {
  difficultyToKoreanMap,
  getRouteRainbowStyleForDifficulty,
  type Difficulty,
} from "@clog/utils";

export type TGymDifficultyColor = components["schemas"]["GymDifficultyColor"];

const parseHexRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const raw = hex.replace("#", "").trim();
  if (raw.length !== 6) return null;
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b };
};

/** HEX + 알파 → `rgba(...)` (배경 투명도 등) */
export const hexToRgba = (hex: string, alpha: number): string => {
  const rgb = parseHexRgb(hex);
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

/** HEX → 대비되는 본문 색 (칩 안 텍스트) */
export const hexToContrastingForeground = (hex: string): string => {
  const rgb = parseHexRgb(hex);
  if (!rgb) return "#fafafa";
  const { r, g, b } = rgb;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "#171717" : "#fafafa";
};

export const sortDifficultyColors = (
  colors: TGymDifficultyColor[] | undefined,
): TGymDifficultyColor[] =>
  colors?.length ? [...colors].sort((a, b) => a.order - b.order) : [];

/** 시트·칩 목록: 암장 순서 있으면 그 순서, 없으면 전역 enum 순서 */
export const getDifficultyOrderForForm = (
  colors: TGymDifficultyColor[] | undefined,
): Difficulty[] => {
  const sorted = sortDifficultyColors(colors);
  if (sorted.length) return sorted.map((c) => c.difficulty);
  return Object.keys(difficultyToKoreanMap) as Difficulty[];
};

export const getDifficultyLabelForGym = (
  difficulty: Difficulty,
  colors: TGymDifficultyColor[] | undefined,
): string => {
  const row = colors?.find((c) => c.difficulty === difficulty);
  return row?.label ?? difficultyToKoreanMap[difficulty];
};

export type TDifficultyChipPresentation =
  | {
      kind: "gym";
      label: string;
      backgroundColor: string;
      foregroundColor: string;
    }
  | {
      kind: "rainbow";
      label: string;
      rainbow: ReturnType<typeof getRouteRainbowStyleForDifficulty>;
    };

export const getDifficultyChipPresentation = (
  difficulty: Difficulty,
  colors: TGymDifficultyColor[] | undefined,
): TDifficultyChipPresentation => {
  const row = colors?.find((c) => c.difficulty === difficulty);
  if (row?.color) {
    return {
      kind: "gym",
      label: row.label,
      backgroundColor: row.color,
      foregroundColor: hexToContrastingForeground(row.color),
    };
  }
  return {
    kind: "rainbow",
    label: difficultyToKoreanMap[difficulty],
    rainbow: getRouteRainbowStyleForDifficulty(difficulty),
  };
};
