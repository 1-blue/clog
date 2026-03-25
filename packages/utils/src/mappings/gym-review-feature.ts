import type { GymReviewFeature } from "../schemas/enums";

/** 암장 리뷰 특징을 한글로 맵핑 */
export const gymReviewFeatureToKoreanMap: Record<GymReviewFeature, string> = {
  COOL_AIR: "쾌적한 냉방",
  WIDE_STRETCH: "넓은 스트레칭존",
  VARIOUS_LEVEL: "다양한 난이도",
  KIND_STAFF: "친절한 스태프",
  EASY_PARKING: "주차 편리",
  SHOWER_ROOM: "샤워실 완비",
  CLEAN_FACILITY: "깨끗한 시설",
  GOOD_VENT: "환기 좋음",
};
