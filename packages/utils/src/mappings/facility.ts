import type { FacilityType } from "../schemas/enums";

/** 시설 타입을 한글로 맵핑 */
export const facilityTypeToKoreanMap: Record<FacilityType, string> = {
  PARKING: "주차장",
  SHOWER: "샤워실",
  LOCKER: "락커",
  RENTAL: "대여",
  CAFE: "카페",
  WIFI: "와이파이",
  REST_AREA: "휴게실",
  TRAINING: "트레이닝",
};
