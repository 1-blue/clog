import type { CommunityCategory } from "@clog/utils";

/** 피드 카드 뱃지 — 카테고리별로 색 구분 */
export const communityCategoryBadgeClassMap: Record<
  CommunityCategory,
  string
> = {
  FREE:
    "border border-primary/35 bg-primary/15 text-primary",
  TIPS:
    "border border-secondary/35 bg-secondary/15 text-secondary",
  REVIEW:
    "border border-tertiary/35 bg-tertiary/15 text-tertiary",
  MEETUP:
    "border border-primary-container/45 bg-primary-container/25 text-on-primary-container",
  GEAR:
    "border border-white/15 bg-white/5 text-on-surface",
};
