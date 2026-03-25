"use client";

import { Search } from "lucide-react";

import { regionToKoreanMap, type Region } from "@clog/utils";

const REGIONS = Object.entries(regionToKoreanMap) as [Region, string][];

interface IProps {
  search: string;
  setSearch: (value: string) => void;
  region: Region | "";
  setRegion: (value: Region | "") => void;
}

const GymSearchBar: React.FC<IProps> = ({
  search,
  setSearch,
  region,
  setRegion,
}) => {
  return (
    <div className="sticky top-0 z-10 mt-4 space-y-3 bg-surface pb-3">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-on-surface-variant" strokeWidth={2} aria-hidden />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="암장 이름 또는 주소 검색"
          className="w-full rounded-2xl bg-surface-container-high py-3 pr-4 pl-10 text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* 지역 필터 */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        <button
          onClick={() => setRegion("")}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            !region
              ? "bg-primary text-primary-foreground"
              : "bg-surface-container-high text-on-surface-variant"
          }`}
        >
          전체
        </button>
        {REGIONS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setRegion(key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              region === key
                ? "bg-primary text-primary-foreground"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GymSearchBar;
