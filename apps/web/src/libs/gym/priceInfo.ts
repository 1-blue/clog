/** 시드/API의 priceInfo JSON 키 → 한글 라벨 */
const PRICE_LABELS: Record<string, string> = {
  daily: "일일",
  monthly: "월간",
  threeMonths: "3개월",
  yearly: "연간",
};

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

  return entries.map(([key, num]) => ({
    label: PRICE_LABELS[key] ?? key,
    value: `${num.toLocaleString("ko-KR")}원`,
  }));
};
