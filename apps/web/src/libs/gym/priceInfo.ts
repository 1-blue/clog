/** 시드/API의 priceInfo JSON 키 → 한글 라벨 */
const PRICE_LABELS: Record<string, string> = {
  daily: "일일 이용권",
  monthly: "1개월 이용권",
  threeMonths: "3개월 이용권",
  tenSession: "10회 이용권",
  yearly: "연간",
};

const PRICE_ORDER = [
  "daily",
  "monthly",
  "threeMonths",
  "tenSession",
  "yearly",
] as const;

/**
 * 암장 priceInfo(JSON)를 화면용 라벨·값 문자열로 변환
 */
export const formatGymPriceInfoLines = (
  priceInfo: Record<string, unknown> | null | undefined,
): { label: string; value: string }[] => {
  if (!priceInfo || typeof priceInfo !== "object") return [];

  const entries = Object.entries(priceInfo).filter(
    ([, v]) => typeof v === "number" && Number.isFinite(v),
  ) as [string, number][];

  const sorted = [...entries].sort((a, b) => {
    const ia = PRICE_ORDER.indexOf(a[0] as (typeof PRICE_ORDER)[number]);
    const ib = PRICE_ORDER.indexOf(b[0] as (typeof PRICE_ORDER)[number]);
    const sa = ia === -1 ? 999 : ia;
    const sb = ib === -1 ? 999 : ib;
    if (sa !== sb) return sa - sb;
    return a[0].localeCompare(b[0]);
  });

  return sorted.map(([key, num]) => ({
    label: PRICE_LABELS[key] ?? key,
    value: `${num.toLocaleString("ko-KR")}원`,
  }));
};
