/** 앱 표시 기준 타임존 (서버/클라이언트·배포 TZ와 무관하게 동일하게 보이도록) */
const KOREA_TZ = "Asia/Seoul";

const timeHmFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: KOREA_TZ,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const monthDayHmFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: KOREA_TZ,
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** 예: 16:28 — 혼잡도 순위 “○○ 기준” 등 */
export const formatKoreaTimeHm = (date: Date): string =>
  timeHmFormatter.format(date);

/**
 * 예: 4월 1일 16:28 — 체크인 종료 예정 등
 * (date-fns `M월 d일 HH:mm`과 동일한 역할, 서울 기준)
 */
export const formatKoreaMonthDayTimeHm = (date: Date): string =>
  monthDayHmFormatter.format(date);

/** 오늘 날짜 yyyy-MM-dd (서울 기준 캘린더) */
export const getKoreaTodayYmd = (date: Date = new Date()): string =>
  date.toLocaleDateString("en-CA", { timeZone: KOREA_TZ });
