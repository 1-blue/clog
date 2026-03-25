"use client";

import { categoryToKoreanMap, type CommunityCategory } from "@clog/utils";

const CATEGORIES = Object.entries(categoryToKoreanMap) as [
  CommunityCategory,
  string,
][];

interface IProps {
  category: CommunityCategory;
  setCategory: (category: CommunityCategory) => void;
}

const CategorySelector: React.FC<IProps> = ({ category, setCategory }) => {
  return (
    <div>
      <label className="text-sm font-medium text-on-surface">카테고리</label>
      <div className="mt-2 flex gap-2">
        {CATEGORIES.map(([key, label]) => (
          <button
            type="button"
            key={key}
            onClick={() => setCategory(key)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              category === key
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
export default CategorySelector;
