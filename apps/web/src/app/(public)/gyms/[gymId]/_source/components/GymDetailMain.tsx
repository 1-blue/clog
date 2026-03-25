"use client";

import { Suspense } from "react";

import { openapi } from "#web/apis/openapi";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "#web/components/ui/tabs";

import GymBasicInfoSection from "./GymBasicInfoSection";
import GymCheckInBar from "./GymCheckInBar";
import GymCongestionSection from "./GymCongestionSection";
import GymHeroSection from "./GymHeroSection";
import GymInfoTabContent from "./GymInfoTabContent";
import GymPhotosTabContent from "./GymPhotosTabContent";
import ReviewListSection from "./review-list/ReviewListSection";
import ReviewListSkeleton from "./skeleton/ReviewListSkeleton";

interface IProps {
  gymId: string;
}

const tabTriggerClass =
  "shrink-0 rounded-none px-0 py-3 text-base font-medium text-muted-foreground hover:text-foreground data-active:font-bold data-active:text-primary";

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

  const visitorCount = liveVisitor?.visitorCount ?? gym.visitorCount;
  const myCheckIn = liveVisitor?.myCheckIn ?? gym.myCheckIn ?? null;
  const capacity = gym.visitorCapacity;

  return (
    <div className="relative pb-[calc(5.75rem+env(safe-area-inset-bottom))]">
      <GymHeroSection gym={gym} />
      <GymBasicInfoSection gym={gym} />
      <GymCongestionSection
        visitorCount={visitorCount}
        capacity={capacity}
        onRefresh={() => void refetchGym()}
      />

      <Tabs defaultValue="info" className="flex w-full flex-col">
        <div className="sticky top-14 z-20 border-b border-outline-variant/10 bg-background/90 backdrop-blur-lg">
          <TabsList
            variant="line"
            className="scrollbar-hide mx-0 h-auto w-full min-w-0 justify-start gap-8 overflow-x-auto rounded-none border-0 bg-transparent px-6 pt-2 pb-0 shadow-none"
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
              <ReviewListSection gymId={gymId} variant="embedded" />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-0 flex-none p-0 text-base">
          <GymPhotosTabContent images={gym.images} />
        </TabsContent>
      </Tabs>

      <GymCheckInBar gymId={gymId} hasActiveCheckIn={myCheckIn != null} />
    </div>
  );
};

export default GymDetailMain;
