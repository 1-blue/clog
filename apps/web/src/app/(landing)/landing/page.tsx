import type { Metadata } from "next";

import { getSharedMetadata } from "#web/libs/sharedMetadata";

import LandingMain from "./_source/LandingMain";

export const metadata: Metadata = getSharedMetadata({
  title: "소개",
  description:
    "체크인으로 암장 혼잡도를, 기록으로 볼더링 통계를, 암장 리뷰와 커뮤니티까지. 클로그는 클라이머를 위한 올인원 서비스입니다.",
  keywords: [
    "클로그 소개",
    "볼더링 앱",
    "클라이밍 혼잡도",
    "클라이밍 통계",
    "암장 리뷰",
    "클라이밍 커뮤니티",
  ],
});

const LandingPage: React.FC = () => {
  return <LandingMain />;
};

export default LandingPage;
