/**
 * 클라이밍 세션 시작·종료 시각 UI/시드 공통 규칙 (같은 날 08:00 ~ 23:55, 5분 단위)
 * DB는 DateTime 그대로 저장하며, Prisma에는 도메인 규칙을 주석으로만 적어 둔다.
 */
export const SESSION_CLOCK_HOUR_MIN = 8;
export const SESSION_CLOCK_HOUR_MAX = 23;

/** 선택 가능한 시 정수 목록 (포함) */
export const SESSION_HOUR_OPTIONS = Array.from(
  { length: SESSION_CLOCK_HOUR_MAX - SESSION_CLOCK_HOUR_MIN + 1 },
  (_, i) => SESSION_CLOCK_HOUR_MIN + i,
);

/** 5분 단위 분 옵션 */
export const SESSION_MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => i * 5);

export const SESSION_MIN_MINUTES = SESSION_CLOCK_HOUR_MIN * 60;
export const SESSION_MAX_MINUTES = SESSION_CLOCK_HOUR_MAX * 60 + 55;

const MIN_GAP_MINUTES = 30;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/** 시작·종료(자정 기준 분)를 허용 범위로 맞추고, 최소 간격을 보장 */
export const normalizeSessionTimeRange = (start: number, end: number) => {
  let s = clamp(Math.round(start), SESSION_MIN_MINUTES, SESSION_MAX_MINUTES);
  let e = clamp(Math.round(end), SESSION_MIN_MINUTES, SESSION_MAX_MINUTES);
  if (e <= s) {
    e = Math.min(SESSION_MAX_MINUTES, s + MIN_GAP_MINUTES);
    if (e <= s) s = Math.max(SESSION_MIN_MINUTES, e - MIN_GAP_MINUTES);
  }
  return { startMinutes: s, endMinutes: e };
};
