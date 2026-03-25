import { z } from "zod";

import { schemas } from "./shared";

/** 댓글 생성 */
export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: schemas.uuid.optional(),
});

/** 댓글 목록 조회 쿼리 */
export const commentQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
});
