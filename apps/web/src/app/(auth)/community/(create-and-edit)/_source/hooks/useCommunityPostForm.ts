"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { z } from "zod";

import {
  COMMUNITY_POST_TAG_MAX_COUNT,
  COMMUNITY_POST_TAG_MAX_LENGTH,
  communityCategoryEnum,
} from "@clog/contracts";

const communityPostFormSchema = z.object({
  category: communityCategoryEnum,
  title: z
    .string()
    .min(2, "제목은 2자 이상 입력해 주세요.")
    .max(100, "제목은 100자 이내로 입력해 주세요."),
  content: z.string().min(10, "내용은 10자 이상 입력해 주세요.").max(5000),
  tags: z
    .array(
      z
        .string()
        .max(
          COMMUNITY_POST_TAG_MAX_LENGTH,
          `태그는 ${COMMUNITY_POST_TAG_MAX_LENGTH}자까지`,
        ),
    )
    .max(
      COMMUNITY_POST_TAG_MAX_COUNT,
      `태그는 최대 ${COMMUNITY_POST_TAG_MAX_COUNT}개까지`,
    ),
  imageUrls: z
    .array(z.string().url())
    .max(10, "이미지는 최대 10개까지 선택할 수 있습니다.")
    .optional(),
});

export type TCommunityPostFormData = z.infer<typeof communityPostFormSchema>;

/** API `CreatePostBody`용 */
export const toCreatePostBody = (data: TCommunityPostFormData) => {
  const tags = data.tags;
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
  const tags = data.tags;
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
      tags: [],
      imageUrls: [],
      ...props?.defaultValues,
    },
    mode: "onChange",
    ...props,
  });
};

export default useCommunityPostForm;
