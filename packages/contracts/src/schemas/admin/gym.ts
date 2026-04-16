import { z } from "zod";

import { GymSchema } from "@clog/db";

import { facilityTypeEnum, gymMembershipBrandEnum, regionEnum } from "../enums";
import { schemas } from "../shared";

const gymInputShape = GymSchema.pick({
  name: true,
  region: true,
  address: true,
  phone: true,
  latitude: true,
  longitude: true,
  description: true,
  coverImageUrl: true,
  logoImageUrl: true,
  membershipBrand: true,
  website: true,
  instagramId: true,
  notice: true,
  difficultyImageUrl: true,
  settingScheduleMemo: true,
  visitorCapacity: true,
  facilities: true,
});

/** 어드민 암장 목록 쿼리 */
export const adminGymQuerySchema = z.object({
  cursor: schemas.cursor,
  limit: schemas.limit,
  search: z
    .string()
    .optional()
    .transform((s) => (s == null ? undefined : s.trim() || undefined)),
  region: regionEnum.optional(),
  /** "all" | "active" | "closed" — 기본 all */
  status: z.enum(["all", "active", "closed"]).optional().default("all"),
});
export type TAdminGymQuery = z.infer<typeof adminGymQuerySchema>;

/** 어드민 암장 생성 */
export const createGymSchema = gymInputShape.extend({
  name: z.string().min(1).max(100),
  region: regionEnum,
  address: z.string().min(1).max(300),
  phone: z.string().min(1).max(30),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().min(1).max(5000),
  coverImageUrl: z.string().min(1).max(1000),
  logoImageUrl: z.string().min(1).max(1000),
  membershipBrand: gymMembershipBrandEnum,
  website: z.string().max(500).nullable().optional(),
  instagramId: z.string().max(100).nullable().optional(),
  notice: z.string().max(2000).nullable().optional(),
  difficultyImageUrl: z.string().max(1000).nullable().optional(),
  settingScheduleMemo: z.string().max(1000).nullable().optional(),
  visitorCapacity: z.number().int().min(0).optional(),
  facilities: z.array(facilityTypeEnum).optional(),
});
export type TCreateGym = z.infer<typeof createGymSchema>;

/** 어드민 암장 수정 (폐업 필드는 별도 엔드포인트) */
export const updateGymSchema = createGymSchema.partial();
export type TUpdateGym = z.infer<typeof updateGymSchema>;

/** 암장 폐업 처리 */
export const closeGymSchema = z.object({
  closedReason: z.string().min(1).max(500),
});
export type TCloseGym = z.infer<typeof closeGymSchema>;
