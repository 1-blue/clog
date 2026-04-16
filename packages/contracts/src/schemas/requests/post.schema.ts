import { z } from "zod";

import { PostSchema } from "@clog/db";

import { communityCategoryEnum } from "../enums";
import { schemas } from "../shared";

/** 커뮤니티 게시글 태그 제한 — OpenAPI·웹 폼과 동기화 */
export const COMMUNITY_POST_TAG_MAX_COUNT = 10;
export const COMMUNITY_POST_TAG_MAX_LENGTH = 20;

// Prisma Post 모델에 해당 필드가 존재해야 .pick 이 통과 — 필드 rename/삭제 시 빌드 에러로 드러남
const postInputShape = PostSchema.pick({
  category: true,
  title: true,
  content: true,
  tags: true,
  imageUrls: true,
});

/** 게시글 생성 */
export const createPostSchema = postInputShape.extend({
  category: communityCategoryEnum,
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(5000),
  tags: z
    .array(z.string().max(COMMUNITY_POST_TAG_MAX_LENGTH))
    .max(COMMUNITY_POST_TAG_MAX_COUNT)
    .optional(),
  imageUrls: z.array(z.string().url()).max(10).optional(),
});

/** 게시글 수정 */
export const updatePostSchema = postInputShape.partial().extend({
  title: z.string().min(2).max(100).optional(),
  content: z.string().min(10).max(5000).optional(),
  category: communityCategoryEnum.optional(),
  tags: z
    .array(z.string().max(COMMUNITY_POST_TAG_MAX_LENGTH))
    .max(COMMUNITY_POST_TAG_MAX_COUNT)
    .optional(),
  imageUrls: z.array(z.string().url()).max(10).optional(),
});

/** 게시글 목록 조회 쿼리 */
export const postQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  category: communityCategoryEnum.optional(),
  search: z.string().optional(),
});
