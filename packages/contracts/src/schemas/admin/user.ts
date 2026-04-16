import { z } from "zod";

import { UserSchema } from "@clog/db";

import { roleEnum } from "../enums";
import { schemas } from "../shared";

const adminUserInputShape = UserSchema.pick({
  nickname: true,
  role: true,
  homeGymId: true,
});

/** 어드민 유저 목록 쿼리 */
export const adminUserQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  search: z
    .string()
    .optional()
    .transform((s) => (s == null ? undefined : s.trim() || undefined)),
  role: roleEnum.optional(),
});
export type TAdminUserQuery = z.infer<typeof adminUserQuerySchema>;

/** 어드민 유저 수정 */
export const adminUpdateUserSchema = adminUserInputShape.partial().extend({
  nickname: z.string().min(1).max(30).optional(),
  role: roleEnum.optional(),
  homeGymId: z.string().uuid().nullable().optional(),
});
export type TAdminUpdateUser = z.infer<typeof adminUpdateUserSchema>;
