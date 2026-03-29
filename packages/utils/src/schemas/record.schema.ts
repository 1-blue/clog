import { z } from "zod";

import { attemptResultEnum, difficultyEnum } from "./enums";
import { schemas } from "./shared";

/** 루트 생성 */
export const createRouteSchema = z.object({
  difficulty: difficultyEnum,
  result: attemptResultEnum,
  attempts: z.number().int().min(1).optional().default(1),
  memo: z.string().max(200).optional(),
});

/** 기록(세션) 생성 */
export const createSessionSchema = z.object({
  gymId: schemas.uuid,
  date: z.coerce.date(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  memo: z.string().max(500).optional(),
  isPublic: z.boolean().optional().default(true),
  routes: z.array(createRouteSchema).min(1),
  imageUrls: z.array(z.string().url()).optional(),
});

/** 기록(세션) 수정 */
export const updateSessionSchema = z.object({
  date: z.coerce.date().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  memo: z.union([z.string().max(500), z.null()]).optional(),
  isPublic: z.boolean().optional(),
  routes: z.array(createRouteSchema).optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

/** 기록 목록 조회 쿼리 */
export const recordQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  /** 방문일(yyyy-MM-dd) — 지정 시 해당 일자 공개 기록만 */
  day: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  /** 조회 월(yyyy-MM) — 지정 시 해당 월의 기록만 */
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
});
