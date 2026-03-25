"use client";

import { ImagePlus } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import MultiImageUploader from "#web/components/shared/MultiImageUploader";
import { Label } from "#web/components/ui/label";

import type { TGymReviewFormData } from "../useGymReviewForm";

const GymReviewPhotoSection = () => {
  const { control, setValue } = useFormContext<TGymReviewFormData>();
  const imageUrls = useWatch({ control, name: "imageUrls" }) ?? [];

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        <ImagePlus className="size-5 text-primary" strokeWidth={2} />
        <Label className="text-base font-semibold text-on-surface">사진</Label>
      </div>
      <p className="text-sm text-on-surface-variant">
        최대 5장까지 추가할 수 있어요.
      </p>
      <MultiImageUploader
        urls={imageUrls}
        onUrlsChange={(urls) => setValue("imageUrls", urls)}
        maxFiles={5}
        emptyLabel="사진 추가"
        className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low/50 p-3"
      />
    </section>
  );
};

export default GymReviewPhotoSection;
