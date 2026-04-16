import { z } from "zod";

import { PostCommentSchema } from "@clog/db";

import { schemas } from "../shared";

const commentContentShape = PostCommentSchema.pick({ content: true });

/** 댓글 생성 */
export const createCommentSchema = commentContentShape.extend({
  content: z
    .string()
    .min(1, "댓글을 입력해주세요.")
    .max(1000, "댓글은 최대 1000자까지 입력할 수 있습니다."),
  parentId: schemas.uuid.optional(),
});

/** 댓글 수정 */
export const updateCommentSchema = commentContentShape.extend({
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
