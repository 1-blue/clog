/**
 * Prisma `GymOpenHour` 행 (API에서 openHours 관계 배열)
 */
export type TGymOpenHourRow = {
  dayType: string;
  open: string;
  close: string;
};

const isGymOpenHourRowArray = (raw: unknown): raw is TGymOpenHourRow[] => {
  if (!Array.isArray(raw) || raw.length === 0) return false;
  return raw.every(
    (r) =>
      r !== null &&
      typeof r === "object" &&
      typeof (r as { dayType?: unknown }).dayType === "string" &&
      typeof (r as { open?: unknown }).open === "string" &&
      typeof (r as { close?: unknown }).close === "string",
  );
};

const DAY_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

const DAY_TYPE_LABEL_KO: Record<(typeof DAY_ORDER)[number], string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

/** en-US short weekday (Asia/Seoul) → Prisma DayType */
const SEOUL_SHORT_TO_DAY_TYPE: Record<string, (typeof DAY_ORDER)[number]> = {
  Mon: "MON",
  Tue: "TUE",
  Wed: "WED",
  Thu: "THU",
  Fri: "FRI",
  Sat: "SAT",
  Sun: "SUN",
};

/**
 * Gym.openHours JSON (Prisma `Json`)
 */
export type TGymOpenHoursSlot = {
  open: string;
  close: string;
};

export type TGymOpenHours = {
  weekday?: TGymOpenHoursSlot;
  saturday?: TGymOpenHoursSlot;
  sunday?: TGymOpenHoursSlot;
  holiday?: TGymOpenHoursSlot;
  notice?: string;
};

const isTimeSlot = (v: unknown): v is TGymOpenHoursSlot => {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.open === "string" &&
    typeof o.close === "string" &&
    o.open.length > 0 &&
    o.close.length > 0
  );
};

/** DB에 저장된 JSON → 구조体 (레거시 `lines` 형식은 null 처리) */
export const parseGymOpenHours = (raw: unknown): TGymOpenHours | null => {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  if (Array.isArray((o as { lines?: unknown }).lines)) {
    return null;
  }

  const out: TGymOpenHours = {};
  if (isTimeSlot(o.weekday)) out.weekday = o.weekday;
  if (isTimeSlot(o.saturday)) out.saturday = o.saturday;
  if (isTimeSlot(o.sunday)) out.sunday = o.sunday;
  if (isTimeSlot(o.holiday)) out.holiday = o.holiday;
  if (typeof o.notice === "string" && o.notice.trim())
    out.notice = o.notice.trim();

  const hasSchedule =
    !!out.weekday || !!out.saturday || !!out.sunday || !!out.holiday;
  if (!hasSchedule && !out.notice) return null;
  return out;
};

const formatRange = (slot: TGymOpenHoursSlot): string =>
  `${slot.open} ~ ${slot.close}`;

export type TGymOpenHoursDisplay = {
  /** 운영 시간 본문 (한 줄씩) */
  scheduleLines: string[];
  /** 비정기 휴무·안내 (있으면 별도 스타일로) */
  notice?: string;
};

/** 화면용: 월–금 / 토·일(또는 분리) / 공휴일 / notice */
const SEOUL_TZ = "Asia/Seoul";

/** en-US short weekday with Asia/Seoul zoned instant → Sun … Sat */
const SEOUL_WEEKDAY_TO_SLOT: Record<string, keyof TGymOpenHours | undefined> = {
  Sun: "sunday",
  Mon: "weekday",
  Tue: "weekday",
  Wed: "weekday",
  Thu: "weekday",
  Fri: "weekday",
  Sat: "saturday",
};

const parseHHMmToMinutes = (
  s: string,
  role: "open" | "close",
): number | null => {
  const trimmed = s.trim();
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) return null;
  const hh = Number(match[1]);
  const mm = Number(match[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm) || mm < 0 || mm > 59)
    return null;
  if (role === "close" && hh === 24 && mm === 0) return 24 * 60;
  if (hh < 0 || hh > 23) return null;
  return hh * 60 + mm;
};

const getSeoulWeekdayKeyAndMinutes = (
  at: Date,
): { weekdayKey: string; minutes: number } | null => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: SEOUL_TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(at);
  const weekdayKey = parts.find((p) => p.type === "weekday")?.value;
  const hourRaw = parts.find((p) => p.type === "hour")?.value;
  const minuteRaw = parts.find((p) => p.type === "minute")?.value;
  if (!weekdayKey || hourRaw === undefined || minuteRaw === undefined) {
    return null;
  }
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  const minutes = hour * 60 + minute;
  return { weekdayKey, minutes };
};

/**
 * 해당 슬롯 구간 안이면 true. 파싱 실패 시 null.
 * - 종료가 익일인 경우(open > close) 익일 0시 전까지 포함.
 * - 종료 `24:00`은 자정 직전까지(분 단위에서는 < 1440).
 */
const isNowWithinSlot = (
  minutesSinceMidnight: number,
  slot: TGymOpenHoursSlot,
): boolean | null => {
  const openM = parseHHMmToMinutes(slot.open, "open");
  const closeM = parseHHMmToMinutes(slot.close, "close");
  if (openM === null || closeM === null) return null;
  if (openM === closeM) return false;

  if (closeM > openM) {
    return minutesSinceMidnight >= openM && minutesSinceMidnight < closeM;
  }

  return minutesSinceMidnight >= openM || minutesSinceMidnight < closeM;
};

export type TGymOpenNowStatus = "open" | "closed" | "unknown";

/**
 * `gym.openHours` JSON 기준, 서울 시각에서 현재 영업 여부.
 * - 요일별 슬롯(`weekday` / `saturday` / `sunday`)만 사용.
 * - `holiday`는 법정 공휴일 판별이 없어 반영하지 않음(추후 플래그/API로 확장 가능).
 * - 레거시 `{ lines }` 전용이거나 파싱 불가면 `unknown`.
 */
export const getGymOpenNowStatus = (
  raw: unknown,
  options?: { at?: Date },
): TGymOpenNowStatus => {
  if (raw && typeof raw === "object") {
    const lines = (raw as { lines?: unknown }).lines;
    if (Array.isArray(lines)) {
      const hasLine = lines.some((l): l is string => typeof l === "string");
      if (hasLine) return "unknown";
    }
  }

  if (isGymOpenHourRowArray(raw)) {
    const zoned = getSeoulWeekdayKeyAndMinutes(options?.at ?? new Date());
    if (!zoned) return "unknown";
    const dayType = SEOUL_SHORT_TO_DAY_TYPE[zoned.weekdayKey];
    if (!dayType) return "unknown";
    const row = raw.find((r) => r.dayType === dayType);
    if (!row) return "unknown";
    const slot: TGymOpenHoursSlot = { open: row.open, close: row.close };
    const within = isNowWithinSlot(zoned.minutes, slot);
    if (within === null) return "unknown";
    return within ? "open" : "closed";
  }

  const parsed = parseGymOpenHours(raw);
  if (!parsed) return "unknown";

  const zoned = getSeoulWeekdayKeyAndMinutes(options?.at ?? new Date());
  if (!zoned) return "unknown";

  const slotName = SEOUL_WEEKDAY_TO_SLOT[zoned.weekdayKey];
  if (!slotName) return "unknown";

  const slot = parsed[slotName];
  if (!isTimeSlot(slot)) return "unknown";

  const within = isNowWithinSlot(zoned.minutes, slot);
  if (within === null) return "unknown";
  return within ? "open" : "closed";
};

export const formatGymOpenHoursDisplay = (
  raw: unknown,
): TGymOpenHoursDisplay => {
  if (raw && typeof raw === "object") {
    const lines = (raw as { lines?: unknown }).lines;
    if (Array.isArray(lines)) {
      const scheduleLines = lines.filter(
        (l): l is string => typeof l === "string",
      );
      if (scheduleLines.length > 0) {
        return { scheduleLines, notice: undefined };
      }
    }
  }

  if (isGymOpenHourRowArray(raw)) {
    const scheduleLines = [...raw]
      .filter((r) =>
        DAY_ORDER.includes(r.dayType as (typeof DAY_ORDER)[number]),
      )
      .sort(
        (a, b) =>
          DAY_ORDER.indexOf(a.dayType as (typeof DAY_ORDER)[number]) -
          DAY_ORDER.indexOf(b.dayType as (typeof DAY_ORDER)[number]),
      )
      .map((r) => {
        const dt = r.dayType as (typeof DAY_ORDER)[number];
        const label = DAY_TYPE_LABEL_KO[dt] ?? r.dayType;
        return `${label}: ${formatRange({ open: r.open, close: r.close })}`;
      });
    return { scheduleLines };
  }

  const parsed = parseGymOpenHours(raw);
  if (!parsed) return { scheduleLines: [] };

  const scheduleLines: string[] = [];

  if (parsed.weekday) {
    scheduleLines.push(`월–금: ${formatRange(parsed.weekday)}`);
  }

  const sat = parsed.saturday;
  const sun = parsed.sunday;
  if (sat && sun && sat.open === sun.open && sat.close === sun.close) {
    scheduleLines.push(`토–일: ${formatRange(sat)}`);
  } else {
    if (sat) scheduleLines.push(`토: ${formatRange(sat)}`);
    if (sun) scheduleLines.push(`일: ${formatRange(sun)}`);
  }

  if (parsed.holiday) {
    scheduleLines.push(`공휴일: ${formatRange(parsed.holiday)}`);
  }

  return {
    scheduleLines,
    notice: parsed.notice,
  };
};

/**
 * 운영 시간 한 줄이 서울 기준 '오늘'에 해당하는 스케줄인지 (강조 표시용)
 * - 요일별 행: `월: 10:00 ~ 22:00`
 * - 레거시 묶음: `월–금: …`, `토–일: …`, `토: …`, `일: …`
 */
export const isOpenHoursLineHighlightedForToday = (
  line: string,
  at: Date = new Date(),
): boolean => {
  const zoned = getSeoulWeekdayKeyAndMinutes(at);
  if (!zoned) return false;
  const dayType = SEOUL_SHORT_TO_DAY_TYPE[zoned.weekdayKey];
  if (!dayType) return false;
  const dayKo = DAY_TYPE_LABEL_KO[dayType];

  const trimmed = line.trim();

  const singleDayMatch = /^([월화수목금토일])[:：]/.exec(trimmed);
  if (singleDayMatch) {
    return singleDayMatch[1] === dayKo;
  }

  if (/^월(?:\u2013|-)금[:：]/.test(trimmed)) {
    return ["MON", "TUE", "WED", "THU", "FRI"].includes(dayType);
  }

  if (/^토(?:\u2013|-)일[:：]/.test(trimmed)) {
    return dayType === "SAT" || dayType === "SUN";
  }

  if (/^토[:：]/.test(trimmed)) {
    return dayType === "SAT";
  }

  if (/^일[:：]/.test(trimmed)) {
    return dayType === "SUN";
  }

  return false;
};

type TOpenCloseSoonBadge =
  | { type: "openSoon"; minutesLeft: number; label: string }
  | { type: "closeSoon"; minutesLeft: number; label: string }
  | null;

const minutesUntilOpen = (
  nowMinutes: number,
  slot: TGymOpenHoursSlot,
): number | null => {
  const openM = parseHHMmToMinutes(slot.open, "open");
  const closeM = parseHHMmToMinutes(slot.close, "close");
  if (openM === null || closeM === null) return null;
  if (openM === closeM) return null;

  // 정상 구간 (예: 10:00~22:00)
  if (closeM > openM) {
    if (nowMinutes >= openM && nowMinutes < closeM) return 0; // 이미 영업 중
    if (nowMinutes < openM) return openM - nowMinutes;
    return null; // 오늘은 이미 종료
  }

  // 익일 마감 (예: 20:00~02:00)
  // - now가 open~24:00 or 00:00~close 구간이면 영업 중
  // - now가 close~open 구간이면 다음 오픈까지 (open - now)
  const isOpenNow =
    nowMinutes >= openM || nowMinutes < closeM;
  if (isOpenNow) return 0;
  return openM - nowMinutes;
};

const minutesUntilClose = (
  nowMinutes: number,
  slot: TGymOpenHoursSlot,
): number | null => {
  const openM = parseHHMmToMinutes(slot.open, "open");
  const closeM = parseHHMmToMinutes(slot.close, "close");
  if (openM === null || closeM === null) return null;
  if (openM === closeM) return null;

  // 정상 구간 (예: 10:00~22:00)
  if (closeM > openM) {
    if (nowMinutes < openM || nowMinutes >= closeM) return null;
    return closeM - nowMinutes;
  }

  // 익일 마감 (예: 20:00~02:00)
  // - now가 open~24:00 구간이면: (1440-now)+close
  // - now가 00:00~close 구간이면: close-now
  if (nowMinutes >= openM) return 24 * 60 - nowMinutes + closeM;
  if (nowMinutes < closeM) return closeM - nowMinutes;
  return null;
};

const formatRemainingKo = (minLeft: number): string => {
  const clamped = Math.max(0, Math.floor(minLeft));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  if (h <= 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
};

const todaySlotFromRaw = (
  raw: unknown,
  at: Date,
): { nowMinutes: number; slot: TGymOpenHoursSlot } | null => {
  const zoned = getSeoulWeekdayKeyAndMinutes(at);
  if (!zoned) return null;

  if (isGymOpenHourRowArray(raw)) {
    const dayType = SEOUL_SHORT_TO_DAY_TYPE[zoned.weekdayKey];
    if (!dayType) return null;
    const row = raw.find((r) => r.dayType === dayType);
    if (!row) return null;
    return {
      nowMinutes: zoned.minutes,
      slot: { open: row.open, close: row.close },
    };
  }

  const parsed = parseGymOpenHours(raw);
  if (!parsed) return null;
  const slotName = SEOUL_WEEKDAY_TO_SLOT[zoned.weekdayKey];
  if (!slotName) return null;
  const slot = parsed[slotName];
  if (!isTimeSlot(slot)) return null;
  return { nowMinutes: zoned.minutes, slot };
};

/**
 * 오픈/마감 임박 배지
 * - 오픈 1시간 전 이내: "곧 오픈 (n분 전)"
 * - 마감 2시간 전 이내: "곧 마감 (n시간 n분 전)"
 */
export const getGymOpenCloseSoonBadge = (
  raw: unknown,
  options?: { at?: Date },
): TOpenCloseSoonBadge => {
  const at = options?.at ?? new Date();
  const today = todaySlotFromRaw(raw, at);
  if (!today) return null;

  const untilClose = minutesUntilClose(today.nowMinutes, today.slot);
  if (untilClose != null && untilClose > 0 && untilClose <= 120) {
    return {
      type: "closeSoon",
      minutesLeft: untilClose,
      label: `곧 마감 (${formatRemainingKo(untilClose)} 전)`,
    };
  }

  const untilOpen = minutesUntilOpen(today.nowMinutes, today.slot);
  if (untilOpen != null && untilOpen > 0 && untilOpen <= 60) {
    return {
      type: "openSoon",
      minutesLeft: untilOpen,
      label: `곧 오픈 (${formatRemainingKo(untilOpen)} 전)`,
    };
  }

  return null;
};
