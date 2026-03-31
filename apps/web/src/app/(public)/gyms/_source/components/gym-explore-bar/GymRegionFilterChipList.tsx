import { useSearchParams } from "next/navigation";

import { regionEnum, regionToKoreanMap, type Region } from "@clog/utils";

import useReplaceQueryParams from "#web/hooks/useReplaceQueryParams";
import { cn } from "#web/libs/utils";

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
    <div className="scrollbar-hide flex gap-2 overflow-x-auto">
      <button
        onClick={() => onChange("")}
        className={cn(
          "shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
          !value
            ? "bg-primary text-primary-foreground"
            : "bg-surface-container-high text-on-surface-variant",
        )}
      >
        전체
      </button>
      {REGIONS.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            value === key
              ? "bg-primary text-primary-foreground"
              : "bg-surface-container-high text-on-surface-variant",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default GymRegionFilterChipList;
