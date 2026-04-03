import { z } from "zod";

import { regionEnum } from "./enums";
import { schemas } from "./shared";

/** 암장 목록 조회 쿼리 */
export const gymQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  region: regionEnum.optional(),
  search: z
    .string()
    .optional()
    .transform((s) => (s == null ? undefined : s.trim() || undefined)),
  sort: z
    .enum([
      "name",
      "rating",
      "congestion",
      "reviewCount",
      "visitorCount",
      "monthlyCheckInCount",
    ])
    .optional()
    .default("name"),
});
