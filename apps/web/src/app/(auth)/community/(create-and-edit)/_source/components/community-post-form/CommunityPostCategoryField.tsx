"use client";

import { categoryToKoreanMap, type CommunityCategory } from "@clog/utils";
import { useFormContext, useWatch } from "react-hook-form";

import type { TCommunityPostFormData } from "../../hooks/useCommunityPostForm";

const CATEGORIES = Object.entries(categoryToKoreanMap) as [
  CommunityCategory,
  string,
][];

const CommunityPostCategoryField: React.FC = () => {
  const { setValue } = useFormContext<TCommunityPostFormData>();
  const category = useWatch({ name: "category" }) as CommunityCategory;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-on-surface">카테고리</span>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(([key, label]) => (
          <button
            type="button"
            key={key}
            onClick={() =>
              setValue("category", key, { shouldValidate: true, shouldDirty: true })
            }
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

export default CommunityPostCategoryField;
