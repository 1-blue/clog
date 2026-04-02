import type { Metadata } from "next";

const SITE_NAME = "클로그";

const sharedTitle: Metadata["title"] = {
  template: `${SITE_NAME} | %s`,
  default: SITE_NAME,
};

/** 검색·SNS 공유용 기본 설명 (기능 요약) */
const sharedDescription = `클라이밍 세션을 기록하고, 암장 체크인으로 실시간 방문자 수를 확인하며, 커뮤니티로 소통하고, 일·주·월 단위 통계로 나만의 클라이밍 리포트를 만드는 서비스입니다.`;

const sharedKeywords = [
  "클로그",
  "clog",
  "클라이밍",
  "실내 클라이밍",
  "볼더링",
  "암장",
  "클라이밍장",
  "클라이밍 기록",
  "운동 기록",
  "암장 체크인",
  "실시간 혼잡도",
  "방문자",
  "클라이밍 커뮤니티",
  "클라이머",
  "클라이밍 통계",
  "주간 통계",
  "월간 통계",
];

/** OG/Twitter 기본 이미지 — `public` 기준 경로 */
const sharedImages = ["/og.png"];

const getSharedKeywords = (title: string) => {
  const t = title.trim();
  if (!t || t === SITE_NAME) return [];
  const words = t.split(/[\s|·,]+/).filter(Boolean);
  return words.slice(0, 8);
};

interface IGetSharedMetadataArgs {
  title?: Metadata["title"];
  description?: string;
  keywords?: string[];
  images?: string[];
}

/** 공용으로 사용할 메타데이터 */
export const getSharedMetadata = ({
  title = sharedTitle,
  description = sharedDescription,
  keywords = sharedKeywords,
  images = sharedImages,
}: IGetSharedMetadataArgs = {}): Metadata => ({
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_CLIENT_URL || "https://clog.story-dict.com",
  ),
  title,
  description,
  keywords: [
    ...new Set([
      ...sharedKeywords,
      ...getSharedKeywords(String(title)),
      ...keywords,
    ]),
  ],
  openGraph: {
    title: title ?? sharedTitle,
    description,
    images,
    type: "website",
    url: process.env.NEXT_PUBLIC_CLIENT_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    countryName: "Korea",
  },
  twitter: {
    card: "summary_large_image",
    title: title ?? sharedTitle,
    description,
    images,
  },
});
