import { z } from "zod";

/** 내 통계 조회 기간 */
export const statisticsPeriodEnum = z.enum(["week", "month", "year", "all"]);

/** GET /api/v1/users/me/statistics 쿼리 */
export const meStatisticsQuerySchema = z.object({
  period: statisticsPeriodEnum,
  /** 기준일 (yyyy-MM-dd). 미입력 시 오늘(서버 기준 처리는 라우트에서) */
  anchor: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type TStatisticsPeriod = z.infer<typeof statisticsPeriodEnum>;
