import { z } from "../../openapi/registry";
import { gymReviewFeatureEnum } from "../enums";
import { AuthorSummary } from "./users.shared";

const PerceivedDifficultyNullable = z
  .enum(["EASY", "EASY_NORMAL", "NORMAL", "NORMAL_HARD", "HARD"])
  .nullable();

export const Review = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    gymId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    content: z.string(),
    perceivedDifficulty: PerceivedDifficultyNullable.optional(),
    features: z.array(gymReviewFeatureEnum),
    imageUrls: z.array(z.string().url()),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("Review");

export const ReviewListItem = Review.extend({
  user: AuthorSummary,
}).openapi("ReviewListItem");

export const PaginatedReviewListItem = z
  .object({
    items: z.array(ReviewListItem),
    nextCursor: z.string().nullable(),
  })
  .openapi("PaginatedReviewListItem");

export const CreateReviewBody = z
  .object({
    rating: z.number().int().min(1).max(5),
    content: z.string().min(10).max(1000),
    perceivedDifficulty: z
      .enum(["EASY", "EASY_NORMAL", "NORMAL", "NORMAL_HARD", "HARD"])
      .optional(),
    features: z.array(gymReviewFeatureEnum).optional(),
    imageUrls: z.array(z.string().url()).optional(),
  })
  .openapi("CreateReviewBody");

export const UpdateReviewBody = CreateReviewBody.openapi("UpdateReviewBody");
