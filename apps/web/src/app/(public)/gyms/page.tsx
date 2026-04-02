import { Suspense } from "react";
import { Metadata } from "next";

import AppTopBar from "#web/components/layout/AppTopBar";
import { getSharedMetadata } from "#web/libs/sharedMetadata";

import GymExploreBar from "./_source/components/gym-explore-bar/GymExploreBar";
import GymListSection from "./_source/components/gym-list-section/GymListSection";

export const metadata: Metadata = getSharedMetadata({
  title: "암장 찾기",
});

const GymsPage = () => {
  return (
    <>
      <AppTopBar
        left={
          <span className="text-lg font-bold text-on-surface">암장 찾기</span>
        }
      />
      <Suspense>
        <div className="pb-8">
          <GymExploreBar />
          <GymListSection />
        </div>
      </Suspense>
    </>
  );
};

export default GymsPage;
