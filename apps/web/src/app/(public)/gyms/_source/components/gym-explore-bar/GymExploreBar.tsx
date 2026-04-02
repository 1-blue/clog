"use client";

import GymRegionFilterChipList from "./GymRegionFilterChipList";
import GymSearchInput from "./GymSearchInput";

const GymExploreBar: React.FC = () => {
  return (
    <div className="z-30 space-y-3 bg-surface pt-4 pb-3">
      <GymSearchInput />
      <GymRegionFilterChipList />
    </div>
  );
};

export default GymExploreBar;
