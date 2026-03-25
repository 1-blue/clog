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

import GymHeroSection from "./gym-hero/GymHeroSection";
import GymBasicInfoSection from "./GymBasicInfoSection";
import GymCheckInBar from "./GymCheckInBar";
import GymCongestionSection from "./GymCongestionSection";
import GymInfoTabContent from "./GymInfoTabContent";
import GymPhotosTabContent from "./GymPhotosTabContent";
import ReviewListSection from "./review-list/ReviewListSection";
import ReviewListSkeleton from "./skeleton/ReviewListSkeleton";

interface IProps {
  gymId: string;
}

/** line 탭: 기본 하단 라인 + 활성 라인 강조 */
const tabTriggerClass =
  "after:hidden relative shrink-0 rounded-none border-0 border-b-2 border-outline-variant/30 px-1 py-3 text-base font-medium text-muted-foreground transition-colors hover:text-foreground " +
  "data-active:border-primary data-active:font-bold data-active:text-primary";

const GymDetailMain: React.FC<IProps> = ({ gymId }) => {
  const { data: gym } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId } } },
    { select: (d) => d.payload },
  );

  const { data: liveVisitor, refetch: refetchGym } = openapi.useQuery(
    "get",
    "/api/v1/gyms/{gymId}",
    { params: { path: { gymId } } },
    {
      select: (d) => ({
        visitorCount: d.payload?.visitorCount ?? 0,
        myCheckIn: d.payload?.myCheckIn ?? null,
      }),
      refetchInterval: 30_000,
    },
  );

  const { data: congestionLogs, refetch: refetchCongestion } = openapi.useQuery(
    "get",
    "/api/v1/gyms/{gymId}/congestion",
    { params: { path: { gymId } } },
    { select: (d) => d.payload },
  );

  const visitorCount = liveVisitor?.visitorCount ?? gym.visitorCount;
  const myCheckIn = liveVisitor?.myCheckIn ?? gym.myCheckIn ?? null;
  const capacity = gym.visitorCapacity;

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
        showBack
        title={gym.name ?? "암장 상세"}
        action={
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

      <GymCongestionSection
        visitorCount={visitorCount}
        capacity={capacity}
        congestionLogs={congestionLogs ?? []}
        onRefresh={async () => {
          await Promise.all([refetchGym(), refetchCongestion()]);
        }}
      />

      <GymBasicInfoSection gym={gym} />

      <Tabs defaultValue="info" className="flex w-full flex-col">
        <div className="sticky top-14 z-20 border-b border-outline-variant/10 bg-background/90 backdrop-blur-lg">
          <TabsList
            variant="line"
            className="scrollbar-hide mx-0 h-auto w-full min-w-0 justify-start gap-2 overflow-x-auto overflow-y-visible rounded-none border-0 bg-transparent px-4 pt-2 pb-1 shadow-none sm:gap-4 sm:px-6"
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

        <TabsContent value="info" className="mt-0 flex-none p-0 text-base">
          <GymInfoTabContent gym={gym} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-0 flex-none p-0 text-base">
          <div className="px-6 py-6">
            <Suspense fallback={<ReviewListSkeleton />}>
              <ReviewListSection
                gymId={gymId}
                variant="embedded"
                avgRating={gym.avgRating}
                reviewCount={gym.reviewCount}
              />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-0 flex-none p-0 text-base">
          <GymPhotosTabContent images={gym.images} gymName={gym.name} />
        </TabsContent>
      </Tabs>

      <GymCheckInBar gymId={gymId} hasActiveCheckIn={myCheckIn != null} />
    </div>
  );
};

export default GymDetailMain;
