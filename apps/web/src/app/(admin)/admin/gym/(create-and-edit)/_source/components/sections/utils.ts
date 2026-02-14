import { Constants } from "@clog/db";

export const gymCityOptions = Constants.public.Enums.gym_city_enum.map(
  (city) => ({
    value: city,
    label: getCityLabel(city),
  })
);

export const gymStatusOptions = Constants.public.Enums.gym_status_enum.map(
  (status) => ({
    value: status,
    label: getStatusLabel(status),
  })
);

export const problemTypeOptions = Constants.public.Enums.problem_type_enum.map(
  (type) => ({
    value: type,
    label: getProblemTypeLabel(type),
  })
);

export const facilityOptions = [
  { value: "has_parking" as const, label: "주차장" },
  { value: "has_locker" as const, label: "락커" },
  { value: "has_shower" as const, label: "샤워실" },
  { value: "has_cafe" as const, label: "카페" },
  { value: "has_shop" as const, label: "샵" },
  { value: "has_footbath" as const, label: "족욕" },
  { value: "has_endurance" as const, label: "지구력" },
  { value: "has_lead" as const, label: "리드" },
] as const;

export function getCityLabel(city: string): string {
  const labels: Record<string, string> = {
    seoul: "서울",
    busan: "부산",
    daegu: "대구",
    incheon: "인천",
    daejeon: "대전",
    gwangju: "광주",
    ulsan: "울산",
    gyeonggi: "경기",
    gangwon: "강원",
    chungbuk: "충북",
    chungnam: "충남",
    jeonbuk: "전북",
    jeonnam: "전남",
    gyeongbuk: "경북",
    gyeongnam: "경남",
    jeju: "제주",
  };
  return labels[city] || city;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "대기",
    active: "활성",
    rejected: "거부",
    inactive: "비활성",
  };
  return labels[status] || status;
}

export function getProblemTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    dyno: "다이노",
    crimpy: "크림피",
    balance: "밸런스",
    slab: "슬랩",
    overhang: "오버행",
    roof: "루프",
    crack: "크랙",
    pinch: "핀치",
    compression: "컴프레션",
    technical: "테크니컬",
    power: "파워",
    endurance: "지구력",
    mixed: "믹스",
  };
  return labels[type] || type;
}
