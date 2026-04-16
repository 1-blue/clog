import type { CommunityCategory } from "../schemas/enums";

/** 커뮤니티 카테고리를 한글로 맵핑 */
export const categoryToKoreanMap: Record<CommunityCategory, string> = {
  FREE: "자유",
  TIPS: "팁",
  REVIEW: "후기",
  MEETUP: "모임",
  GEAR: "장비",
};

/** 커뮤니티 카테고리 뱃지 색상 키워드 맵핑 */
export type TCategoryBadgeColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "primaryContainer"
  | "gear";

/** 커뮤니티 카테고리 뱃지 색상 */
export const postCategoryMap: Record<CommunityCategory, TCategoryBadgeColor> = {
  FREE: "primary",
  TIPS: "secondary",
  REVIEW: "tertiary",
  MEETUP: "primaryContainer",
  GEAR: "gear",
};
