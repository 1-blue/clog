// 도시 매핑 (영어 → 한글)
export const cityMapping: Record<string, string> = {
  seoul: "서울",
  busan: "부산",
  daegu: "대구",
  incheon: "인천",
  daejeon: "대전",
  gwangju: "광주",
  ulsan: "울산",
  gyeonggi: "경기도",
  gangwon: "강원도",
  chungbuk: "충청북도",
  chungnam: "충청남도",
  jeonbuk: "전라북도",
  jeonnam: "전라남도",
  gyeongbuk: "경상북도",
  gyeongnam: "경상남도",
  jeju: "제주도",
  all: "전체 지역",
};

// 도시 한글 가져오기
export const getCityLabel = (city: string | null): string => {
  if (!city || city === "all") return cityMapping.all;
  return cityMapping[city] || city;
};

// 상태 매핑 (영어 → 한글)
export const statusMapping: Record<string, string> = {
  pending: "대기",
  active: "활성",
  rejected: "거부",
  inactive: "비활성",
  all: "전체 상태",
};

// 상태 한글 → 영어 (역매핑, 필요시 사용)
export const statusReverseMapping: Record<string, string> = {
  대기: "pending",
  활성: "active",
  거부: "rejected",
  비활성: "inactive",
  "전체 상태": "all",
};

// 상태 색상 매핑
export const statusColorMap: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "대기",
  },
  active: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "활성",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "거부",
  },
  inactive: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "비활성",
  },
};

// 기본 상태 색상 (매핑에 없는 경우)
export const defaultStatusColor = {
  bg: "bg-gray-100",
  text: "text-gray-800",
  label: "알 수 없음",
};

// 상태 한글 가져오기
export const getStatusLabel = (status: string | null): string => {
  if (!status || status === "all") return statusMapping.all;
  return statusMapping[status] || status;
};

// 상태 색상 가져오기
export const getStatusColor = (status: string | null) => {
  if (!status) return defaultStatusColor;
  return statusColorMap[status] || defaultStatusColor;
};
