import type { Metadata } from "next";

const sharedTitle: Metadata["title"] = {
  template: "%s | 클로그",
  default: "클로그",
};
const sharedDescription = `클로그는 커뮤니티 서비스입니다.`;
const sharedKeywords = ["클로그", "커뮤니티", "커뮤니티 서비스"];
const sharedImages = ["/images/common/preview.jpg"];

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
    process.env.NEXT_PUBLIC_CLIENT_URL || "https://clog.kr"
  ),
  title,
  description,
  keywords: [...new Set([...sharedKeywords, ...keywords])],
  openGraph: {
    title: title ?? sharedTitle,
    description,
    images,
    type: "website",
    url: process.env.NEXT_PUBLIC_CLIENT_URL,
    siteName: sharedDescription,
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
