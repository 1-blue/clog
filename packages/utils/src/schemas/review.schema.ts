import { z } from "zod";

import { gymReviewFeatureEnum, perceivedDifficultyEnum } from "./enums";
import { schemas } from "./shared";

/** 리뷰 생성 */
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().min(10).max(1000),
  perceivedDifficulty: perceivedDifficultyEnum.optional(),
  features: z.array(gymReviewFeatureEnum).optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

/** 리뷰 목록 조회 쿼리 */
export const reviewQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
});
