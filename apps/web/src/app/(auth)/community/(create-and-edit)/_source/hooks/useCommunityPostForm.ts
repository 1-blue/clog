"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { z } from "zod";

import { communityCategoryEnum } from "@clog/utils";

/** 쉼표 구분 태그 입력 → 배열 (최대 5개) */
export const parseCommaSeparatedTags = (input: string | undefined): string[] =>
  (input ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 5);

const communityPostFormSchema = z
  .object({
    category: communityCategoryEnum,
    title: z
      .string()
      .min(2, "제목은 2자 이상 입력해 주세요.")
      .max(100, "제목은 100자 이내로 입력해 주세요."),
    content: z.string().min(10, "내용은 10자 이상 입력해 주세요.").max(5000),
    tagInput: z
      .string()
      .max(200, "태그는 200자 이내로 입력해 주세요.")
      .optional(),
    imageUrls: z
      .array(z.string().url())
      .max(10, "이미지는 최대 10개까지 선택할 수 있습니다.")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const tags = parseCommaSeparatedTags(data.tagInput);
    if (tags.length > 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "태그는 최대 5개까지",
        path: ["tagInput"],
      });
    }
    for (const t of tags) {
      if (t.length > 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "태그는 20자까지",
          path: ["tagInput"],
        });
        break;
      }
    }
  });

export type TCommunityPostFormData = z.infer<typeof communityPostFormSchema>;

/** API `CreatePostBody`용 */
export const toCreatePostBody = (data: TCommunityPostFormData) => {
  const tags = parseCommaSeparatedTags(data.tagInput);
  return {
    category: data.category,
    title: data.title,
    content: data.content,
    ...(tags.length > 0 ? { tags } : {}),
    ...(data.imageUrls && data.imageUrls.length > 0
      ? { imageUrls: data.imageUrls }
      : {}),
  };
};

/** API `UpdatePostBody`용 — 수정 시 전체 필드 동기화 */
export const toUpdatePostBody = (data: TCommunityPostFormData) => {
  const tags = parseCommaSeparatedTags(data.tagInput);
  return {
    category: data.category,
    title: data.title,
    content: data.content,
    tags,
    imageUrls: data.imageUrls ?? [],
  };
};

const useCommunityPostForm = (
  props?: Partial<UseFormProps<TCommunityPostFormData>>,
) => {
  return useForm<TCommunityPostFormData>({
    resolver: zodResolver(communityPostFormSchema),
    defaultValues: {
      category: "FREE",
      title: "",
      content: "",
      tagInput: "",
      imageUrls: [],
      ...props?.defaultValues,
    },
    mode: "onChange",
    ...props,
  });
};

export default useCommunityPostForm;
