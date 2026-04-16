import { z } from "zod";

import { schemas } from "../shared";

const ymd = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "yyyy-MM-dd 형식이어야 합니다");

/** 내 회원권 등록 */
export const createUserMembershipBodySchema = z.object({
  gymId: schemas.uuid,
  planId: schemas.uuid,
  startedDateYmd: ymd,
  note: z.string().max(500).optional(),
});

/** 내 회원권 수정 (제한 필드) */
export const patchUserMembershipBodySchema = z.object({
  note: z.union([z.string().max(500), z.null()]).optional(),
  startedDateYmd: ymd.optional(),
});

/** 일시정지 추가 */
export const createMembershipPauseBodySchema = z.object({
  startDateYmd: ymd,
  endDateYmd: ymd,
});

/** 일시정지 수정 */
export const patchMembershipPauseBodySchema = z.object({
  startDateYmd: ymd.optional(),
  endDateYmd: ymd.optional(),
});

/** GET /users/me/memberships */
export const userMembershipListQuerySchema = z.object({
  gymId: schemas.uuid.optional(),
  activeOnly: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});
