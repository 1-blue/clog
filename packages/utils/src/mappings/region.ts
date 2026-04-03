import type { Region } from "../schemas/enums";

/** 지역을 한글로 맵핑 */
export const regionToKoreanMap: Record<Region, string> = {
  SEOUL: "서울",
  GYEONGGI: "경기",
  INCHEON: "인천",
  BUSAN: "부산",
};
