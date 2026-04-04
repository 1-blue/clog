/** openapi-fetch / react-query 체크아웃 응답에서 자동 생성 세션 ID 추출 */
export const extractCheckoutCreatedSessionId = (
  res: unknown,
): string | null | undefined => {
  if (!res || typeof res !== "object") return undefined;
  if (
    "data" in res &&
    res.data &&
    typeof res.data === "object" &&
    "payload" in res.data
  ) {
    const p = (res.data as { payload: { createdSessionId?: string | null } })
      .payload;
    return p.createdSessionId ?? null;
  }
  if ("payload" in res && res.payload && typeof res.payload === "object") {
    const p = res.payload as { createdSessionId?: string | null };
    return p.createdSessionId ?? null;
  }
  return undefined;
};
