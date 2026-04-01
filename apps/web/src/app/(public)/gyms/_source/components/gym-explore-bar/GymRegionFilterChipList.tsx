import { useSearchParams } from "next/navigation";

import { regionEnum, regionToKoreanMap, type Region } from "@clog/utils";

import FilterChip from "#web/components/shared/FilterChip";
import useReplaceQueryParams from "#web/hooks/useReplaceQueryParams";

const REGIONS = Object.entries(regionToKoreanMap) as [Region, string][];

const GymRegionFilterChipList: React.FC = () => {
  const searchParams = useSearchParams();
  const { replaceQueryParams } = useReplaceQueryParams();

  const regionRaw = searchParams.get("region") ?? "";
  const value = regionEnum.safeParse(regionRaw).success
    ? (regionRaw as Region)
    : "";

  const onChange = (next: Region | "") => {
    replaceQueryParams({ region: next }, { scroll: false });
  };

  return (
    <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto">
      <FilterChip
        size="xs"
        label="전체"
        selected={!value}
        onClick={() => onChange("")}
      />
      {REGIONS.map(([key, label]) => (
        <FilterChip
          key={key}
          size="xs"
          label={label}
          selected={value === key}
          onClick={() => onChange(key)}
        />
      ))}
    </div>
  );
};

export default GymRegionFilterChipList;
