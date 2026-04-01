"use client";

import { Suspense } from "react";

import AppTopBar from "#web/components/layout/AppTopBar";

import GymExploreBar from "./_source/components/gym-explore-bar/GymExploreBar";
import GymListSection from "./_source/components/gym-list-section/GymListSection";

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
