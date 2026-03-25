/** 막대가 사라지지 않도록 최소 비율 (0명일 때도 칼럼 유지) */
const MIN_BAR_RATIO = 0.06;

export type TCongestionLogRow = {
  dayOfWeek: number;
  hour: number;
  congestion: number;
};

const SEOUL_TZ = "Asia/Seoul";

const WD_SHORT_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** 서울 기준 요일(0=일) · 시 · 분 */
export const getSeoulCongestionClock = (
  at: Date,
): { dayOfWeek: number; hour: number; minute: number } | null => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: SEOUL_TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(at);
  const wd = parts.find((p) => p.type === "weekday")?.value;
  const hr = parts.find((p) => p.type === "hour")?.value;
  const min = parts.find((p) => p.type === "minute")?.value;
  if (!wd || hr === undefined || min === undefined) return null;
  const dayOfWeek = WD_SHORT_TO_INDEX[wd];
  const hour = Number(hr);
  const minute = Number(min);
  if (
    dayOfWeek === undefined ||
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return null;
  }
  return { dayOfWeek, hour, minute };
};

/** 차트에 올 시간대 10~22 (길이 13) */
export const CONGESTION_CHART_HOURS = Array.from(
  { length: 13 },
  (_, i) => 10 + i,
) as number[];

/**
 * 시간대별 로그(요일·시별 혼잡도 0~100) + 현재 슬롯은 실시간 체크인 비율 반영
 */
export const congestionBarHeightsFromLogs = (
  logs: TCongestionLogRow[],
  at: Date,
  visitorCount: number,
  capacity: number,
): { heights: number[]; currentIndex: number } => {
  const clock = getSeoulCongestionClock(at);
  const liveRatio = Math.min(1, visitorCount / Math.max(1, capacity));
  const byKey = new Map(
    logs.map((l) => [`${l.dayOfWeek}:${l.hour}`, l.congestion] as const),
  );

  if (!clock) {
    return {
      heights: CONGESTION_CHART_HOURS.map(() =>
        Math.max(MIN_BAR_RATIO, liveRatio),
      ),
      currentIndex: 6,
    };
  }

  const { dayOfWeek, hour: currentHour } = clock;
  const currentIndex = Math.min(
    CONGESTION_CHART_HOURS.length - 1,
    Math.max(0, Math.min(22, Math.max(10, currentHour)) - 10),
  );
  const inChart =
    currentHour >= CONGESTION_CHART_HOURS[0]! &&
    currentHour <= CONGESTION_CHART_HOURS[CONGESTION_CHART_HOURS.length - 1]!;

  const heights = CONGESTION_CHART_HOURS.map((hour) => {
    const key = `${dayOfWeek}:${hour}` as const;
    const c = byKey.get(key) ?? 0;
    let ratio = Math.min(1, Math.max(0, c / 100));
    if (inChart && hour === currentHour) {
      ratio = liveRatio;
    } else if (!inChart && hour === CONGESTION_CHART_HOURS[currentIndex]) {
      ratio = liveRatio;
    }
    return Math.max(MIN_BAR_RATIO, ratio);
  });

  return { heights, currentIndex };
};

/** 혼잡도 수준 라벨 */
export const flowLabel = (
  visitorCount: number,
  capacity: number,
): string => {
  const r = visitorCount / Math.max(1, capacity);
  if (r < 0.35) return "여유 있어요";
  if (r < 0.65) return "쾌적해요";
  if (r < 0.9) return "보통이에요";
  return "다소 붐벼요";
};
