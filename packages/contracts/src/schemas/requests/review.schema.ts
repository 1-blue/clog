import { z } from "zod";

import { GymReviewSchema } from "@clog/db";

import { gymReviewFeatureEnum, perceivedDifficultyEnum } from "../enums";
import { schemas } from "../shared";

const reviewInputShape = GymReviewSchema.pick({
  rating: true,
  content: true,
  perceivedDifficulty: true,
  features: true,
  imageUrls: true,
});

/** 리뷰 생성 */
export const createReviewSchema = reviewInputShape.extend({
  /** 직렬화에 따라 문자열로 올 수 있음 — API 라우트에서 coerce 권장 */
  rating: z.coerce.number().int().min(1).max(5),
  content: z
    .string()
    .min(10, "최소 10자 이상 입력해 주세요.")
    .max(1000, "최대 1000자 이내로 입력해 주세요."),
  perceivedDifficulty: perceivedDifficultyEnum.optional(),
  features: z.array(gymReviewFeatureEnum).optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

/** 리뷰 수정 (본문 전체 갱신) */
export const updateReviewSchema = createReviewSchema;

/** 리뷰 목록 조회 쿼리 */
export const reviewQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
});
