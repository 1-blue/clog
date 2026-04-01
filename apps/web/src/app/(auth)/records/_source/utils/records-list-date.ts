import { startOfDay } from "date-fns";

/** 캘린더를 이 날짜 이전으로는 이동 불가 */
export const CALENDAR_START = new Date(2026, 0, 1);

/** 기록 목록에서 선택 날짜를 나타내는 쿼리 키 (값: yyyy-MM-dd) */
export const DATE_QUERY_KEY = "date";

/** 날짜 문자열(ISO)을 로컬 자정 Date로 변환 (타임존 안전) */
export const toLocalDate = (isoDate: string) => {
  const [y, m, d] = isoDate.split("T")[0]!.split("-").map(Number);
  return new Date(y!, m! - 1, d!);
};

/** yyyy-MM-dd → 로컬 자정 Date, 유효하지 않으면 null */
export const parseYmd = (s: string | null) => {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);

  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);

  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }

  return dt;
};

export const clampSelectedDate = (d: Date) => {
  const n = new Date();
  const todayStart = startOfDay(n);
  const dStart = startOfDay(d);
  const calStart = startOfDay(CALENDAR_START);

  if (dStart < calStart) return calStart;
  if (dStart > todayStart) return todayStart;

  return dStart;
};

/** `date` 쿼리(없거나 잘못되면 오늘) → 허용 구간으로 clamp한 선택일 */
export const getSelectedDateFromQuery = (
  getParam: (key: string) => string | null,
): Date => {
  const raw = getParam(DATE_QUERY_KEY);
  const parsed = parseYmd(raw);
  const base = parsed ?? startOfDay(new Date());

  return clampSelectedDate(base);
};
