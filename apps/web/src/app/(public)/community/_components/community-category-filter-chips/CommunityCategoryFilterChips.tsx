"use client";

import { categoryToKoreanMap, communityCategoryEnum, type CommunityCategory } from "@clog/utils";
import { useSearchParams } from "next/navigation";

import FilterChip from "#web/components/shared/FilterChip";
import useReplaceQueryParams from "#web/hooks/useReplaceQueryParams";

const CATEGORIES = Object.entries(categoryToKoreanMap) as [
  CommunityCategory,
  string,
][];

const CommunityCategoryFilterChips: React.FC = () => {
  const searchParams = useSearchParams();
  const { replaceQueryParams } = useReplaceQueryParams();

  const categoryRaw = searchParams.get("category") ?? "";
  const category = communityCategoryEnum.safeParse(categoryRaw).success
    ? (categoryRaw as CommunityCategory)
    : "";

  const onChange = (next: CommunityCategory | "") => {
    replaceQueryParams({ category: next }, { scroll: false });
  };

  return (
    <nav className="scrollbar-hide flex items-center gap-2.5 overflow-x-auto bg-background">
      <FilterChip
        size="sm"
        label="전체"
        selected={!category}
        onClick={() => onChange("")}
      />
      {CATEGORIES.map(([key, label]) => (
        <FilterChip
          key={key}
          size="sm"
          label={label}
          selected={category === key}
          onClick={() => onChange(key)}
        />
      ))}
    </nav>
  );
};

export default CommunityCategoryFilterChips;
