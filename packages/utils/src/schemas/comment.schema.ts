import { z } from "zod";

import { schemas } from "./shared";

/** 댓글 생성 */
export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "댓글을 입력해주세요.")
    .max(1000, "댓글은 최대 1000자까지 입력할 수 있습니다."),
  parentId: schemas.uuid.optional(),
});

/** 댓글 수정 */
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "댓글을 입력해주세요.")
    .max(1000, "댓글은 최대 1000자까지 입력할 수 있습니다."),
});

/** 댓글 목록 조회 쿼리 */
export const commentQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
});
