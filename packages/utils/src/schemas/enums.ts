import { z } from "zod";

export const providerEnum = z.enum(["KAKAO", "GOOGLE"]);
export type Provider = z.infer<typeof providerEnum>;

export const roleEnum = z.enum(["ADMIN", "MANAGER", "GUEST"]);
export type Role = z.infer<typeof roleEnum>;

export const regionEnum = z.enum([
  "SEOUL",
  "GYEONGGI",
  "INCHEON",
  "BUSAN",
  "DAEGU",
  "DAEJEON",
  "GWANGJU",
  "ULSAN",
  "SEJONG",
  "GANGWON",
  "CHUNGBUK",
  "CHUNGNAM",
  "JEONBUK",
  "JEONNAM",
  "GYEONGBUK",
  "GYEONGNAM",
  "JEJU",
]);
export type Region = z.infer<typeof regionEnum>;

export const difficultyEnum = z.enum([
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "V_PLUS",
]);
export type Difficulty = z.infer<typeof difficultyEnum>;

export const communityCategoryEnum = z.enum([
  "FREE",
  "TIPS",
  "REVIEW",
  "MEETUP",
  "GEAR",
]);
export type CommunityCategory = z.infer<typeof communityCategoryEnum>;

export const notificationTypeEnum = z.enum([
  "COMMENT",
  "LIKE",
  "FOLLOW",
  "SYSTEM",
  "GYM_UPDATE",
]);
export type NotificationType = z.infer<typeof notificationTypeEnum>;

export const facilityTypeEnum = z.enum([
  "PARKING",
  "SHOWER",
  "LOCKER",
  "RENTAL",
  "CAFE",
  "WIFI",
  "REST_AREA",
  "TRAINING",
]);
export type FacilityType = z.infer<typeof facilityTypeEnum>;

export const attemptResultEnum = z.enum([
  "SEND",
  "ATTEMPT",
  "FLASH",
  "ONSIGHT",
]);
export type AttemptResult = z.infer<typeof attemptResultEnum>;

export const perceivedDifficultyEnum = z.enum(["EASY", "NORMAL", "HARD"]);
export type PerceivedDifficulty = z.infer<typeof perceivedDifficultyEnum>;

export const gymReviewFeatureEnum = z.enum([
  "COOL_AIR",
  "WIDE_STRETCH",
  "VARIOUS_LEVEL",
  "KIND_STAFF",
  "EASY_PARKING",
  "SHOWER_ROOM",
  "CLEAN_FACILITY",
  "GOOD_VENT",
]);
export type GymReviewFeature = z.infer<typeof gymReviewFeatureEnum>;
