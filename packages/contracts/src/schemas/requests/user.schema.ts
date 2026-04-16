import { z } from "zod";

import { UserSchema } from "@clog/db";

import { difficultyEnum, pushPlatformEnum } from "../enums";
import { schemas } from "../shared";

const userProfileShape = UserSchema.pick({
  nickname: true,
  bio: true,
  profileImage: true,
  coverImage: true,
  instagramId: true,
  youtubeUrl: true,
  maxDifficulty: true,
  checkInAutoDurationMinutes: true,
  homeGymId: true,
  pushNotificationsEnabled: true,
});

/** 유저 프로필 수정 */
export const updateUserSchema = userProfileShape.partial().extend({
  nickname: schemas.nickname.optional(),
  bio: z.string().max(200).optional(),
  profileImage: schemas.url.optional(),
  coverImage: schemas.url.optional(),
  instagramId: z.string().max(50).optional(),
  youtubeUrl: schemas.url.max(200).optional(),
  maxDifficulty: difficultyEnum.optional(),
  /** 체크인 후 자동 체크아웃까지 분 (30~720) */
  checkInAutoDurationMinutes: z.number().int().min(30).max(720).optional(),
  /** 홈짐(암장) ID — null이면 해제 */
  homeGymId: z.string().uuid().nullable().optional(),
  /** 푸시 알림 수신 허용 */
  pushNotificationsEnabled: z.boolean().optional(),
});

/** Expo 푸시 등록 플랫폼 — Prisma `PushPlatform` 파생 */
export const pushPlatformSchema = pushPlatformEnum;

/** POST /users/me/push-device */
export const registerPushDeviceSchema = z.object({
  token: z.string().min(1).max(512),
  platform: pushPlatformEnum,
});

/** DELETE /users/me/push-device — 쿼리 */
export const deletePushDeviceQuerySchema = z.object({
  token: z.string().min(1),
});

/** GET /users/me/nickname-availability 쿼리 */
export const nicknameAvailabilityQuerySchema = z.object({
  nickname: schemas.nickname,
});
