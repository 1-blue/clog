import { z } from "zod";

import { difficultyEnum } from "./enums";
import { schemas } from "./shared";

/** 유저 프로필 수정 */
export const updateUserSchema = z.object({
  nickname: schemas.nickname.optional(),
  bio: z.string().max(200).optional(),
  profileImage: schemas.url.optional(),
  coverImage: schemas.url.optional(),
  instagramId: z.string().max(50).optional(),
  youtubeUrl: schemas.url.max(200).optional(),
  maxDifficulty: difficultyEnum.optional(),
  /** 체크인 후 자동 체크아웃까지 분 (30~720) */
  checkInAutoDurationMinutes: z.number().int().min(30).max(720).optional(),
});

/** GET /users/me/nickname-availability 쿼리 */
export const nicknameAvailabilityQuerySchema = z.object({
  nickname: schemas.nickname,
});
