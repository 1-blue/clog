/** 앱 표시용 (배포 시 env로 덮어쓸 수 있음) */
export const SETTINGS_APP_NAME = "클로그";
export const SETTINGS_APP_VERSION = "1.0.0";

export const SETTINGS_CHECKOUT_DURATION_OPTIONS = [
  { minutes: 60, label: "1시간" },
  { minutes: 120, label: "2시간" },
  { minutes: 180, label: "3시간" },
  { minutes: 240, label: "4시간 (기본)" },
  { minutes: 360, label: "6시간" },
  { minutes: 480, label: "8시간" },
  { minutes: 720, label: "12시간" },
] as const;

/** 트리거 표시용: 분 → `N시간` / 그 외 `N분` */
export const formatCheckoutDurationTriggerLabel = (minutes: number): string => {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "—";
  }
  if (minutes % 60 === 0) {
    return `${minutes / 60}시간`;
  }
  return `${minutes}분`;
};

export const SETTINGS_PUSH_STORAGE_KEY = "clog-settings-push-enabled";
