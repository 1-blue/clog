import { z } from "zod";

import {
  AdminAuditAction,
  ClimbingAttemptResult,
  DayType,
  Difficulty,
  GymFacilityType,
  GymMembershipBrand,
  GymPerceivedDifficulty,
  GymReviewFeature,
  MembershipPlanCode,
  NotificationType,
  PostCategory,
  Provider,
  PushPlatform,
  Region,
  Role,
} from "@clog/db";

// 타입은 Prisma 가 SSOT — 직접 re-export
export type {
  AdminAuditAction,
  ClimbingAttemptResult,
  DayType,
  Difficulty,
  GymFacilityType,
  GymMembershipBrand,
  GymPerceivedDifficulty,
  GymReviewFeature,
  MembershipPlanCode,
  NotificationType,
  PostCategory,
  Provider,
  PushPlatform,
  Region,
  Role,
} from "@clog/db";

// Zod 스키마 — Prisma 런타임 enum 객체로부터 파생
export const providerEnum = z.nativeEnum(Provider).openapi("Provider");
export const roleEnum = z.nativeEnum(Role).openapi("Role");
export const regionEnum = z.nativeEnum(Region).openapi("Region");
export const difficultyEnum = z.nativeEnum(Difficulty).openapi("Difficulty");
export const dayTypeEnum = z.nativeEnum(DayType).openapi("DayType");
export const facilityTypeEnum = z
  .nativeEnum(GymFacilityType)
  .openapi("FacilityType");
export const gymReviewFeatureEnum = z
  .nativeEnum(GymReviewFeature)
  .openapi("GymReviewFeature");
export const perceivedDifficultyEnum = z
  .nativeEnum(GymPerceivedDifficulty)
  .openapi("GymPerceivedDifficulty");
export const attemptResultEnum = z
  .nativeEnum(ClimbingAttemptResult)
  .openapi("AttemptResult");
export const postCategoryEnum = z
  .nativeEnum(PostCategory)
  .openapi("CommunityCategory");
export const notificationTypeEnum = z
  .nativeEnum(NotificationType)
  .openapi("NotificationType");
export const membershipPlanCodeEnum = z
  .nativeEnum(MembershipPlanCode)
  .openapi("MembershipPlanCode");
export const gymMembershipBrandEnum = z
  .nativeEnum(GymMembershipBrand)
  .openapi("GymMembershipBrand");
export const pushPlatformEnum = z
  .nativeEnum(PushPlatform)
  .openapi("PushPlatform");
export const adminAuditActionEnum = z
  .nativeEnum(AdminAuditAction)
  .openapi("AdminAuditAction");

// 하위 호환 alias — 기존 import 경로 무수정 유지
export const communityCategoryEnum = postCategoryEnum;
export type CommunityCategory = PostCategory;
export type FacilityType = GymFacilityType;
export type PerceivedDifficulty = GymPerceivedDifficulty;
export type AttemptResult = ClimbingAttemptResult;
