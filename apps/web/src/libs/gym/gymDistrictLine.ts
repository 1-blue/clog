import { regionToKoreanMap, type Region } from "@clog/utils";

/** 카드용 짧은 지역 표기 (예: 서울 강남구) */
export const gymDistrictLine = (region: Region, address: string) => {
  const r = regionToKoreanMap[region];
  const parts = address.trim().split(/\s+/).filter(Boolean);
  const gu = parts.find((p) => /(구|시|군)$/.test(p) && !p.startsWith("서울"));

  if (gu) return `${r} ${gu}`;
  if (parts.length >= 2) return `${r} ${parts[1]}`;

  return r;
};
