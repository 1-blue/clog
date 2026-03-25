/** 혼잡도 바 차트 높이 비율 배열 */
export const congestionBarHeights = (
  visitorCount: number,
  capacity: number,
): number[] => {
  const r = Math.min(1, visitorCount / Math.max(1, capacity));
  return [0.3, 0.45, 0.6, 0.85, r, 0.9, 0.55, 0.4, 0.25, 0.2, 0.15];
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
