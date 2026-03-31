/**
 * 하단 네비를 숨기는 경로 (암장 상세·리뷰 작성 등 전체 폭/하단 CTA 전용 화면)
 */
/** `/community/[postId]` 단일 세그먼트 (목록 `/community`는 제외) */
function isCommunityPostDetail(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  return (
    parts.length === 2 &&
    parts[0] === "community" &&
    /^[0-9a-f-]{36}$/i.test(parts[1] ?? "")
  );
}

export function shouldShowBottomNav(pathname: string | null): boolean {
  if (!pathname) return true;
  if (pathname.startsWith("/login")) return false;
  if (pathname.startsWith("/gyms/")) return false;
  if (isCommunityPostDetail(pathname)) return false;
  /** 글 작성·수정 — 하단 네비·체크인 배너 숨김 (암장 리뷰 작성과 동일) */
  if (pathname.startsWith("/community/create")) return false;
  if (pathname.startsWith("/community/edit")) return false;
  return true;
}
