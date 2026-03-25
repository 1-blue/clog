import { z } from "zod";

import { communityCategoryEnum } from "./enums";
import { schemas } from "./shared";

/** 게시글 생성 */
export const createPostSchema = z.object({
  category: communityCategoryEnum,
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(5000),
  tags: z.array(z.string().max(20)).max(5).optional(),
  imageUrls: z.array(z.string().url()).max(10).optional(),
});

/** 게시글 수정 */
export const updatePostSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  content: z.string().min(10).max(5000).optional(),
  category: communityCategoryEnum.optional(),
  tags: z.array(z.string().max(20)).max(5).optional(),
  imageUrls: z.array(z.string().url()).max(10).optional(),
});

/** 게시글 목록 조회 쿼리 */
export const postQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  category: communityCategoryEnum.optional(),
  search: z.string().optional(),
});
