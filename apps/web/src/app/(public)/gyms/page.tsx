"use client";

import { useState } from "react";

import type { Region } from "@clog/utils";

import GymListSection from "./_source/components/GymListSection";
import GymSearchBar from "./_source/components/GymSearchBar";

const GymsPage = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region | "">("");

  return (
    <div className="px-4 pt-4 pb-8">
      {/* 헤더 */}
      <h1 className="text-4xl font-bold tracking-tight text-on-background break-keep">
        암장 찾기
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
        이름이나 지역으로 검색하고, 실시간 혼잡도를 확인하세요
      </p>

      {/* 검색 + 필터 */}
      <GymSearchBar
        search={search}
        setSearch={setSearch}
        region={region}
        setRegion={setRegion}
      />

      {/* 암장 목록 */}
      <GymListSection search={search} region={region} />
    </div>
  );
};

export default GymsPage;
