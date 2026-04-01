import {
  attemptResultToKoreanMap,
  difficultyToKoreanMap,
  type AttemptResult,
  type Difficulty,
} from "@clog/utils";

import {
  getDifficultyLabelForGym,
  type TGymDifficultyColor,
} from "#web/app/(auth)/records/(created-and-edit)/_source/utils/gym-difficulty-presentation";

const DIFF_ORDER: Difficulty[] = [
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

const diffIdx = (d: Difficulty) => DIFF_ORDER.indexOf(d);

export const maxDifficultyLabel = (
  routes: { difficulty: string }[],
): string => {
  if (routes.length === 0) return "—";
  const key = routes.reduce(
    (max, r) =>
      diffIdx(r.difficulty as Difficulty) > diffIdx(max as Difficulty)
        ? r.difficulty
        : max,
    routes[0]!.difficulty,
  ) as Difficulty;
  return difficultyToKoreanMap[key] ?? key;
};

/** 암장 난이도 라벨이 있으면 우선 사용 */
export const maxDifficultyLabelWithGym = (
  routes: { difficulty: string }[],
  colors: TGymDifficultyColor[] | undefined,
): string => {
  if (routes.length === 0) return "—";
  const key = routes.reduce(
    (max, r) =>
      diffIdx(r.difficulty as Difficulty) > diffIdx(max as Difficulty)
        ? r.difficulty
        : max,
    routes[0]!.difficulty,
  ) as Difficulty;
  return getDifficultyLabelForGym(key, colors);
};

/** 스티치형 "V4 ~ V5" 범위 (시도한 난이도 최소~최대) */
export const difficultySpreadLabel = (
  routes: { difficulty: string }[],
): string => {
  if (routes.length === 0) return "—";
  const idxs = routes.map((r) => diffIdx(r.difficulty as Difficulty));
  const lo = Math.min(...idxs);
  const hi = Math.max(...idxs);
  const low = DIFF_ORDER[lo]!;
  const high = DIFF_ORDER[hi]!;
  if (low === high) return difficultyToKoreanMap[low];
  return `${difficultyToKoreanMap[low]} ~ ${difficultyToKoreanMap[high]}`;
};

export const difficultySpreadLabelWithGym = (
  routes: { difficulty: string }[],
  colors: TGymDifficultyColor[] | undefined,
): string => {
  if (routes.length === 0) return "—";
  const idxs = routes.map((r) => diffIdx(r.difficulty as Difficulty));
  const lo = Math.min(...idxs);
  const hi = Math.max(...idxs);
  const low = DIFF_ORDER[lo]!;
  const high = DIFF_ORDER[hi]!;
  if (low === high) return getDifficultyLabelForGym(low, colors);
  return `${getDifficultyLabelForGym(low, colors)} ~ ${getDifficultyLabelForGym(high, colors)}`;
};

/** 시도한 난이도 최저~최고 등급 (예: `V4` 또는 `V2 ~ V7`) */
export const difficultySpreadGradeLabel = (
  routes: { difficulty: string }[],
): string => {
  if (routes.length === 0) return "—";
  const idxs = routes.map((r) => diffIdx(r.difficulty as Difficulty));
  const lo = Math.min(...idxs);
  const hi = Math.max(...idxs);
  const low = DIFF_ORDER[lo]!;
  const high = DIFF_ORDER[hi]!;
  if (low === high) return low;
  return `${low} ~ ${high}`;
};

/** 최고 난이도 enum 키 (예: `V8`) */
export const maxDifficultyGradeLabel = (
  routes: { difficulty: string }[],
): string => {
  if (routes.length === 0) return "—";
  const key = routes.reduce(
    (max, r) =>
      diffIdx(r.difficulty as Difficulty) > diffIdx(max as Difficulty)
        ? r.difficulty
        : max,
    routes[0]!.difficulty,
  ) as Difficulty;
  return key;
};

/** 시도한 난이도 최저·최고 (스프레드 시각화용) */
export const difficultySpreadBounds = (
  routes: { difficulty: string }[],
): { low: Difficulty; high: Difficulty } | null => {
  if (routes.length === 0) return null;
  const idxs = routes
    .map((r) => diffIdx(r.difficulty as Difficulty))
    .filter((i) => i >= 0);
  if (idxs.length === 0) return null;
  const lo = Math.min(...idxs);
  const hi = Math.max(...idxs);
  return { low: DIFF_ORDER[lo]!, high: DIFF_ORDER[hi]! };
};

/** 최고 난이도 enum (스와치 1개용) */
export const maxDifficultyFromRoutes = (
  routes: { difficulty: string }[],
): Difficulty | null => {
  if (routes.length === 0) return null;
  const key = routes.reduce(
    (max, r) =>
      diffIdx(r.difficulty as Difficulty) > diffIdx(max as Difficulty)
        ? r.difficulty
        : max,
    routes[0]!.difficulty,
  ) as Difficulty;
  return diffIdx(key) >= 0 ? key : null;
};

/** 루트별 시도 결과 개수 (완등/플래시/온사이트/시도만) */
export const attemptResultBreakdown = (
  routes: { result: string }[],
): Record<AttemptResult, number> => {
  const counts: Record<AttemptResult, number> = {
    SEND: 0,
    ATTEMPT: 0,
    FLASH: 0,
    ONSIGHT: 0,
  };
  for (const r of routes) {
    const k = r.result as AttemptResult;
    if (k in counts) counts[k] += 1;
  }
  return counts;
};

export const sendCount = (routes: { result: string }[]) =>
  routes.filter((r) => r.result !== "ATTEMPT").length;

/** 로컬 시각 기준 "14시" / "10시 30분" */
export const formatWallClockKo = (d: Date): string => {
  const h = d.getHours();
  const m = d.getMinutes();
  if (m === 0) return `${h}시`;
  return `${h}시 ${m}분`;
};

/** "3시간 30분" / "45분" */
export const formatDurationKo = (totalMin: number): string => {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
};

export interface IExerciseTimeSummary {
  durationMin: number;
  /** 예: 10시 30분 ~ 14시 */
  rangeLabel: string;
  /** 예: 총 3시간 30분 */
  totalLabel: string;
}

export const getExerciseTimeSummary = (
  startTime: string | null | undefined,
  endTime: string | null | undefined,
): IExerciseTimeSummary | null => {
  if (!startTime || !endTime) return null;
  const s = new Date(startTime);
  const e = new Date(endTime);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  if (e.getTime() <= s.getTime()) return null;
  const durationMin = Math.max(
    1,
    Math.round((e.getTime() - s.getTime()) / 60_000),
  );
  return {
    durationMin,
    rangeLabel: `${formatWallClockKo(s)} ~ ${formatWallClockKo(e)}`,
    totalLabel: `총 ${formatDurationKo(durationMin)}`,
  };
};

export const estimateKcal = (durationMin: number) =>
  Math.max(0, Math.round(durationMin * 7));

export const routeRowTitle = (
  difficulty: Difficulty,
  memo: string | null,
): string => {
  const trimmed = memo?.trim();
  if (trimmed && trimmed.length <= 48) return trimmed;
  return `${difficultyToKoreanMap[difficulty]} 홀드`;
};

export const routeRowSubtitle = (
  attempts: number,
  result: AttemptResult,
): string => {
  const tail =
    result === "SEND"
      ? "완등"
      : result === "FLASH"
        ? "플래시"
        : result === "ONSIGHT"
          ? "온사이트"
          : attemptResultToKoreanMap[result];
  return `${attempts}회 시도 · ${tail}`;
};
