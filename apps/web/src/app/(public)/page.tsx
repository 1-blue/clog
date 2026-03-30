import { Suspense } from "react";
import type { NextPage } from "next";

import AppTopBar from "#web/components/layout/AppTopBar";

import CommunityPreviewSection from "./_source/components/CommunityPreviewSection";
import CompletionTrendSection from "./_source/components/CompletionTrendSection";
import CongestionRankingSection from "./_source/components/CongestionRankingSection";
import HomeCheckInSection from "./_source/components/HomeCheckInSection";
import HotSpotSection from "./_source/components/HotSpotSection";
import NearbyGymsSection from "./_source/components/NearbyGymsSection";
import CommunityPreviewSkeleton from "./_source/components/skeleton/CommunityPreviewSkeleton";
import CompletionTrendSkeleton from "./_source/components/skeleton/CompletionTrendSkeleton";
import CongestionRankingSkeleton from "./_source/components/skeleton/CongestionRankingSkeleton";
import HotSpotSkeleton from "./_source/components/skeleton/HotSpotSkeleton";
import NearbyGymsSkeleton from "./_source/components/skeleton/NearbyGymsSkeleton";

/**
 * 빌드 시 정적 프리렌더에서 클라이언트 섹션 SSR이 `NEXT_PUBLIC_API_URL`로 fetch 하면
 * 백엔드 미기동 시 ECONNREFUSED로 실패한다. 홈만 요청 시 렌더로 둔다.
 */
export const dynamic = "force-dynamic";

/** 홈 / 탐색 페이지 */
const HomePage: NextPage = () => {
  return (
    <div className="pb-8">
      {/* 상단 바 */}
      <AppTopBar />

      <div className="mt-4 space-y-12 px-6">
        {/* 빠른 체크인 (로그인 유저 전용) */}
        <HomeCheckInSection />

        <Suspense fallback={<CongestionRankingSkeleton />}>
          <CongestionRankingSection />
        </Suspense>

        <Suspense fallback={<CompletionTrendSkeleton />}>
          <CompletionTrendSection />
        </Suspense>

        <Suspense fallback={<HotSpotSkeleton />}>
          <HotSpotSection />
        </Suspense>

        <Suspense fallback={<NearbyGymsSkeleton />}>
          <NearbyGymsSection />
        </Suspense>

        <Suspense fallback={<CommunityPreviewSkeleton />}>
          <CommunityPreviewSection />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
