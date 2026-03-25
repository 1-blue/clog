"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { z } from "zod";

import { createReviewSchema } from "@clog/utils";

/** 프론트 전용 폼 스키마 — API 스키마에서 UX 맞춤 확장 */
const gymReviewFormSchema = createReviewSchema.extend({
  /** 기본값 0이지만 제출 시 최소 1 필요 */
  rating: z.number().int().min(1, "별점을 선택해 주세요.").max(5),
});

export type TGymReviewFormData = z.infer<typeof gymReviewFormSchema>;

const useGymReviewForm = (
  props?: Partial<UseFormProps<TGymReviewFormData>>,
) => {
  return useForm<TGymReviewFormData>({
    resolver: zodResolver(gymReviewFormSchema),
    defaultValues: {
      rating: 0,
      content: "",
      perceivedDifficulty: undefined,
      features: [],
      imageUrls: [],
      ...props?.defaultValues,
    },
    mode: "onChange",
    ...props,
  });
};

export default useGymReviewForm;
