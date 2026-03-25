/** 조회수 등 짧은 숫자 표기 (예: 1.2k) */
export const formatCompactCount = (n: number): string => {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 10 ? Math.round(k) : k.toFixed(1)}k`;
  }
  return n.toLocaleString("ko-KR");
};
