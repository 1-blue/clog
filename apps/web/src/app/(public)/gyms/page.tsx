"use client";

import { useState } from "react";

import type { Region } from "@clog/utils";

import AppTopBar from "#web/components/layout/AppTopBar";
import useDebounce from "#web/hooks/useDebounce";

import GymListSection from "./_source/components/GymListSection";
import GymSearchBar from "./_source/components/GymSearchBar";

const GymsPage = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region | "">("");

  const debouncedSearch = useDebounce(search, 300);

  return (
    <>
      <AppTopBar
        left={
          <span className="text-lg font-bold text-on-surface">암장 찾기</span>
        }
      />
      <div className="px-4 pb-8">
        <GymSearchBar
          search={search}
          setSearch={setSearch}
          region={region}
          setRegion={setRegion}
        />
        <GymListSection search={debouncedSearch} region={region} />
      </div>
    </>
  );
};

export default GymsPage;
