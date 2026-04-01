/** 리뷰 목록·단건 API에서 공통으로 쓰는 user include */
export const gymReviewListInclude = {
  user: { select: { id: true, nickname: true, profileImage: true } },
} as const;
