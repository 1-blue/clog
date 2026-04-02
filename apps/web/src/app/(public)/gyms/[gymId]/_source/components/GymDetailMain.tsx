"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";

import { openapi } from "#web/apis/openapi";
import TopBar from "#web/components/layout/TopBar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "#web/components/ui/tabs";

import GymBasicInfoSection from "./gym-basic-info-section/GymBasicInfoSection";
import GymCheckInBar from "./gym-check-in-bar/GymCheckInBar";
import GymCheckInStatusBanner from "./gym-check-in-status-banner/GymCheckInStatusBanner";
import GymHeroSection from "./gym-hero-section/GymHeroSection";
import GymLiveStatsStrip from "./gym-live-stats-strip/GymLiveStatsStrip";
import GymInfoTab from "./gym-tabs/gym-info-tab/GymInfoTab";
import GymPhotoTab from "./gym-tabs/gym-photo-tab/GymPhotoTab";
import GymReviewSkeleton from "./gym-tabs/gym-review-tab/gym-review-list/GymReviewSkeleton";
import GymReviewTab from "./gym-tabs/gym-review-tab/GymReviewTab";
import GymHomeGymActions from "./GymHomeGymActions";

/** line 탭: 기본 하단 라인 + 활성 라인 강조 */
const tabTriggerClass =
  "after:hidden relative shrink-0 rounded-none border-0 border-b-2 border-outline-variant/30 px-1 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer " +
  "data-active:border-primary data-active:font-bold data-active:text-primary!";

interface IProps {
  gymId: string;
}

const GymDetailMain: React.FC<IProps> = ({ gymId }) => {
  const { data: gym } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId } } },
    { select: (d) => d.payload },
  );

  const { data: liveVisitor } = openapi.useQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId } } },
    {
      select: (d) => ({
        visitorCount: d.payload?.visitorCount ?? 0,
        myCheckIn: d.payload?.myCheckIn ?? null,
        congestion: d.payload?.congestion ?? 0,
        visitorCapacity: d.payload?.visitorCapacity ?? 0,
        monthlyCheckInCount: d.payload?.monthlyCheckInCount ?? null,
      }),
      refetchInterval: 30_000,
    },
  );

  const myCheckIn = liveVisitor?.myCheckIn ?? gym.myCheckIn ?? null;

  const congestion = liveVisitor?.congestion ?? gym.congestion;
  const visitorCount = liveVisitor?.visitorCount ?? gym.visitorCount;
  const visitorCapacity = liveVisitor?.visitorCapacity ?? gym.visitorCapacity;
  const monthlyCheckInCount =
    liveVisitor?.monthlyCheckInCount ?? gym.monthlyCheckInCount;

  const shareGym = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ title: gym.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.message("링크를 복사했어요");
      }
    } catch {
      /* 사용자 취소 등 */
    }
  };

  return (
    <div className="relative pb-[calc(5.75rem+env(safe-area-inset-bottom))]">
      <TopBar
        showNotification={false}
        title={gym.name ?? "암장 상세"}
        right={
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => void shareGym()}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full text-primary hover:bg-white/5"
              aria-label="공유"
            >
              <Share2 className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        }
      />

      <GymHeroSection gym={gym} />

      <div className="flex flex-col gap-6 pt-6 pb-4">
        {myCheckIn && <GymCheckInStatusBanner endsAt={myCheckIn.endsAt} />}

        <GymLiveStatsStrip
          congestion={congestion}
          visitorCount={visitorCount}
          visitorCapacity={visitorCapacity}
          monthlyCheckInCount={monthlyCheckInCount}
        />

        <GymHomeGymActions gymId={gymId} />

        <GymBasicInfoSection gym={gym} />
      </div>

      <Tabs defaultValue="info" className="flex w-full flex-col">
        <div className="sticky top-14 z-20 border-b border-outline-variant/10 bg-background/90 backdrop-blur-lg">
          <TabsList
            variant="line"
            className="scrollbar-hide mx-0 h-auto w-full min-w-0 justify-start gap-2 overflow-x-auto overflow-y-visible rounded-none border-0 bg-transparent shadow-none sm:gap-4"
          >
            <TabsTrigger value="info" className={tabTriggerClass}>
              정보
            </TabsTrigger>
            <TabsTrigger value="reviews" className={tabTriggerClass}>
              리뷰 ({gym.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="photos" className={tabTriggerClass}>
              사진
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="mt-0 flex-none p-0 px-2 text-base">
          <GymInfoTab gym={gym} />
        </TabsContent>

        <TabsContent
          value="reviews"
          className="mt-0 flex-none p-0 px-2 text-base"
        >
          <div className="pb-4">
            <Suspense fallback={<GymReviewSkeleton />}>
              <GymReviewTab
                gymId={gymId}
                avgRating={gym.avgRating}
                reviewCount={gym.reviewCount}
              />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent
          value="photos"
          className="mt-0 flex-none p-0 px-2 text-base"
        >
          <GymPhotoTab images={gym.images} gymName={gym.name} />
        </TabsContent>
      </Tabs>

      <GymCheckInBar gymId={gymId} hasActiveCheckIn={myCheckIn !== null} />
    </div>
  );
};

export default GymDetailMain;
