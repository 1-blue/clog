"use client";

import { categoryToKoreanMap, type CommunityCategory } from "@clog/utils";

import { cn } from "#web/libs/utils";

const CATEGORIES = Object.entries(categoryToKoreanMap) as [
  CommunityCategory,
  string,
][];

interface IProps {
  category: CommunityCategory | "";
  setCategory: (value: CommunityCategory | "") => void;
}

const CategoryTabs = ({ category, setCategory }: IProps) => {
  return (
    <nav className="scrollbar-hide flex items-center gap-2.5 overflow-x-auto pb-4">
      <button
        type="button"
        onClick={() => setCategory("")}
        className={cn(
          "shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors",
          !category
            ? "bg-primary font-bold text-on-primary shadow-sm shadow-primary/20"
            : "border border-outline-variant/10 bg-surface-container-low font-semibold text-on-surface-variant hover:bg-surface-container-high",
        )}
      >
        전체
      </button>
      {CATEGORIES.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setCategory(key)}
          className={cn(
            "shrink-0 rounded-full px-5 py-2 text-sm transition-colors",
            category === key
              ? "bg-primary font-bold text-on-primary shadow-sm shadow-primary/20"
              : "border border-outline-variant/10 bg-surface-container-low font-semibold text-on-surface-variant hover:bg-surface-container-high",
          )}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

export default CategoryTabs;
