import { format, parseISO } from "date-fns";

import { normalizeSessionTimeRange } from "@clog/utils";

/** 기록 `date` ISO → 방문일 yyyy-MM-dd (로컬 달력 기준) */
export function recordDateToYmd(dateIso: string): string {
  return format(parseISO(dateIso), "yyyy-MM-dd");
}

function isoToWallMinutes(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

/** 기존 세션의 시작·종료 시각 → DurationField용 분 (없으면 기본 구간) */
export function initialSessionMinutesFromRecord(
  startTime: string | null,
  endTime: string | null,
): { startMinutes: number; endMinutes: number } {
  const s = isoToWallMinutes(startTime);
  const e = isoToWallMinutes(endTime);
  if (s != null && e != null) {
    return normalizeSessionTimeRange(s, e);
  }
  return normalizeSessionTimeRange(10 * 60 + 30, 14 * 60);
}
