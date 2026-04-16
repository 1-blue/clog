import { z } from "zod";

import { schemas } from "../shared";

/** 어드민 에러 로그 쿼리 */
export const errorLogQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  method: z.string().optional(),
  httpStatus: z.coerce.number().int().optional(),
  endpoint: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
export type TErrorLogQuery = z.infer<typeof errorLogQuerySchema>;
