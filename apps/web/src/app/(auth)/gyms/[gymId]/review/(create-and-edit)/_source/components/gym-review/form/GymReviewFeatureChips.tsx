"use client";

import { Check, Plus } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import {
  gymReviewFeatureToKoreanMap,
  type GymReviewFeature,
} from "@clog/contracts";

import { Label } from "#web/components/ui/label";
import { cn } from "#web/libs/utils";

import type { TGymReviewFormData } from "../../../_hooks/useGymReviewForm";

const GymReviewFeatureChips = () => {
  const { control, setValue } = useFormContext<TGymReviewFormData>();
  const features = useWatch({ control, name: "features" }) ?? [];

  const toggleFeature = (feature: GymReviewFeature) => {
    const next = features.includes(feature)
      ? features.filter((f) => f !== feature)
      : [...features, feature];
    setValue("features", next);
  };

  return (
    <section className="space-y-3">
      <Label className="text-base font-semibold text-on-surface">
        암장 특징
      </Label>
      <p className="text-sm text-on-surface-variant">
        해당되는 항목을 모두 선택해 주세요.
      </p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(gymReviewFeatureToKoreanMap).map(([key, label]) => {
          const feature = key as GymReviewFeature;
          const selected = features.includes(feature);
          return (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-dashed border-outline-variant bg-transparent text-on-surface-variant hover:bg-surface-container-high",
              )}
            >
              {selected ? (
                <Check className="size-3.5 shrink-0" strokeWidth={2.5} />
              ) : (
                <Plus className="size-3.5 shrink-0" strokeWidth={2.5} />
              )}
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default GymReviewFeatureChips;
