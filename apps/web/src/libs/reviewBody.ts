/**
 * 리뷰 생성·수정 요청 JSON을 Zod 스키마와 맞춤.
 * - optional 필드에 `null`이 오면 Zod는 배열/enum을 기대하므로 실패함 → 키 제거
 * - imageUrls에 빈 문자열 슬롯이 있으면 `.url()` 검증 실패 → 제거
 */
export const normalizeReviewJsonBody = (raw: unknown): unknown => {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return raw;
  const o = { ...(raw as Record<string, unknown>) };

  if (o.perceivedDifficulty === null || o.perceivedDifficulty === "") {
    delete o.perceivedDifficulty;
  }
  if (o.features === null) {
    delete o.features;
  }
  if (o.imageUrls === null) {
    delete o.imageUrls;
  } else if (Array.isArray(o.imageUrls)) {
    o.imageUrls = o.imageUrls.filter(
      (u) => typeof u === "string" && u.trim().length > 0,
    );
  }

  return o;
};
