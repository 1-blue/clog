import {
  UserMembershipSchema,
  UserPushDeviceSchema,
  UserSchema,
} from "@clog/db";

import { z } from "../../openapi/registry";
import {
  difficultyEnum,
  gymMembershipBrandEnum,
  membershipPlanCodeEnum,
  pushPlatformEnum,
  roleEnum,
} from "../enums";
import { AuthorSummary, HomeGymSummary } from "./users.shared";

export const UserCounts = z
  .object({
    following: z.number().int(),
    followers: z.number().int(),
    sessions: z.number().int(),
  })
  .openapi("UserCounts");

export const ActiveCheckIn = z
  .object({
    id: z.string().uuid(),
    gymId: z.string().uuid(),
    gymName: z.string(),
    startedAt: z.string().datetime(),
    endsAt: z.string().datetime(),
  })
  .openapi("ActiveCheckIn");

export const UserMe = UserSchema.pick({
  id: true,
  email: true,
  nickname: true,
  bio: true,
  profileImage: true,
  coverImage: true,
  instagramId: true,
  youtubeUrl: true,
  maxDifficulty: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  homeGymId: true,
  checkInAutoDurationMinutes: true,
  pushNotificationsEnabled: true,
})
  .extend({
    id: z.string().uuid(),
    email: z.string().email(),
    nickname: z.string(),
    bio: z.string().nullable(),
    profileImage: z.string().nullable(),
    coverImage: z.string().nullable(),
    instagramId: z.string().nullable(),
    youtubeUrl: z.string().nullable(),
    maxDifficulty: difficultyEnum.nullable(),
    role: roleEnum,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    homeGymId: z.string().uuid().nullable(),
    homeGym: HomeGymSummary.nullable(),
    _count: UserCounts,
    visitCount: z.number().int(),
    sendCount: z.number().int(),
    checkInAutoDurationMinutes: z.number().int().min(30).max(720),
    pushNotificationsEnabled: z.boolean(),
    linkedProviders: z.array(z.enum(["KAKAO", "GOOGLE"])),
    activeCheckIn: ActiveCheckIn.nullable(),
  })
  .openapi("UserMe");

export const User = UserSchema.pick({
  id: true,
  email: true,
  nickname: true,
  bio: true,
  profileImage: true,
  coverImage: true,
  instagramId: true,
  youtubeUrl: true,
  maxDifficulty: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  homeGymId: true,
  checkInAutoDurationMinutes: true,
  pushNotificationsEnabled: true,
})
  .extend({
    id: z.string().uuid(),
    email: z.string().email(),
    nickname: z.string(),
    bio: z.string().nullable(),
    profileImage: z.string().nullable(),
    coverImage: z.string().nullable(),
    instagramId: z.string().nullable(),
    youtubeUrl: z.string().nullable(),
    maxDifficulty: difficultyEnum.nullable(),
    role: roleEnum,
    checkInAutoDurationMinutes: z.number().int().min(30).max(720),
    pushNotificationsEnabled: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    homeGymId: z.string().uuid().nullable(),
    homeGym: HomeGymSummary.nullable(),
  })
  .openapi("User");

export const UserProfile = z
  .object({
    id: z.string().uuid(),
    homeGymId: z.string().uuid().nullable(),
    homeGym: HomeGymSummary.nullable(),
    nickname: z.string(),
    bio: z.string().nullable(),
    profileImage: z.string().nullable(),
    coverImage: z.string().nullable(),
    instagramId: z.string().nullable(),
    youtubeUrl: z.string().nullable(),
    maxDifficulty: difficultyEnum.nullable(),
    createdAt: z.string().datetime(),
    _count: UserCounts,
    visitCount: z.number().int(),
    sendCount: z.number().int(),
    activityHeatmap: z.array(z.number().int().min(0).max(4)),
    activityHeatmapDays: z.array(z.string()),
    activityHeatmapSessionCount: z.number().int(),
    followers: z
      .array(
        z.object({
          id: z.string().uuid(),
        }),
      )
      .optional(),
  })
  .openapi("UserProfile");

export const UpdateUserBody = z
  .object({
    nickname: z.string().min(1).max(20).optional(),
    bio: z.string().max(200).optional(),
    profileImage: z.string().url().optional(),
    coverImage: z.string().url().optional(),
    instagramId: z.string().max(50).optional(),
    youtubeUrl: z.string().url().max(200).optional(),
    maxDifficulty: difficultyEnum.optional(),
    checkInAutoDurationMinutes: z.number().int().min(30).max(720).optional(),
    homeGymId: z.string().uuid().nullable().optional(),
    pushNotificationsEnabled: z.boolean().optional(),
  })
  .openapi("UpdateUserBody");

export const RegisterPushDeviceBody = z
  .object({
    token: z.string().min(1),
    platform: pushPlatformEnum,
  })
  .openapi("RegisterPushDeviceBody");

export const UserPushDevice = UserPushDeviceSchema.pick({
  id: true,
  userId: true,
  expoPushToken: true,
  platform: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    expoPushToken: z.string(),
    platform: pushPlatformEnum,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("UserPushDevice");

export const PaginatedFollowUser = z
  .object({
    items: z.array(AuthorSummary),
    nextCursor: z.string().uuid().nullable(),
  })
  .openapi("PaginatedFollowUser");

export const UserMembership = UserMembershipSchema.pick({
  id: true,
  userId: true,
  gymId: true,
  planId: true,
  startedAt: true,
  remainingUses: true,
  note: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    gymId: z.string().uuid(),
    planId: z.string().uuid(),
    startedAt: z.string().datetime(),
    remainingUses: z.number().int().nullable(),
    startedDateYmd: z.string(),
    note: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    // 아래는 YAML 기준 합성 필드
    plan: z.object({
      id: z.string().uuid(),
      code: membershipPlanCodeEnum,
      priceWon: z.number().int(),
      sortOrder: z.number().int(),
      isActive: z.boolean(),
    }),
    gym: z.object({
      id: z.string().uuid(),
      name: z.string(),
      membershipBrand: gymMembershipBrandEnum,
      logoImageUrl: z.string().nullable().optional(),
    }),
    pauses: z.array(
      z.object({
        id: z.string().uuid(),
        startDateYmd: z.string(),
        endDateYmd: z.string(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
      }),
    ),
    effectiveEndAt: z.string().datetime(),
    lastValidDateYmd: z.string(),
    isActive: z.boolean(),
  })
  .openapi("UserMembership");

export const CreateUserMembershipBody = z
  .object({
    gymId: z.string().uuid(),
    planId: z.string().uuid(),
    startedDateYmd: z.string(),
    note: z.string().max(500).optional(),
  })
  .openapi("CreateUserMembershipBody");

export const PatchUserMembershipBody = z
  .object({
    note: z.string().max(500).nullable().optional(),
    startedDateYmd: z.string().optional(),
  })
  .openapi("PatchUserMembershipBody");

export const MembershipPauseItem = z
  .object({
    id: z.string().uuid(),
    startDateYmd: z.string(),
    endDateYmd: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("MembershipPauseItem");

export const CreateMembershipPauseBody = z
  .object({
    startDateYmd: z.string(),
    endDateYmd: z.string(),
  })
  .openapi("CreateMembershipPauseBody");

export const PatchMembershipPauseBody = z
  .object({
    startDateYmd: z.string().optional(),
    endDateYmd: z.string().optional(),
  })
  .openapi("PatchMembershipPauseBody");

export const UserMembershipUsagePayload = z
  .object({
    membership: z.object({
      id: z.string().uuid(),
      gymId: z.string().uuid(),
      planCode: membershipPlanCodeEnum,
      startedDateYmd: z.string(),
      lastValidDateYmd: z.string(),
      remainingUses: z.number().int().nullable(),
      remainingDays: z.number().int(),
      gym: z.object({
        id: z.string().uuid(),
        name: z.string(),
        membershipBrand: gymMembershipBrandEnum,
        logoImageUrl: z.string().nullable().optional(),
      }),
    }),
    stats: z.object({
      totalUsed: z.number(),
      weeklyAverage: z.number(),
      usageRatePercent: z.number().nullable().optional(),
      initialCount: z.number().int().nullable().optional(),
    }),
    sessions: z.array(
      z.object({
        id: z.string().uuid(),
        date: z.string().datetime(),
        gymName: z.string(),
        gymLogoImageUrl: z.string().nullable().optional(),
        routeCount: z.number().int(),
      }),
    ),
  })
  .openapi("UserMembershipUsagePayload");

export const MeStatisticsPayload = z
  .object({
    period: z.enum(["week", "month", "year", "all"]),
    anchor: z.string(),
    range: z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
      label: z.string(),
    }),
    previousRange: z
      .object({
        start: z.string().datetime(),
        end: z.string().datetime(),
      })
      .nullable(),
    kpis: z.object({
      totalSends: z.number().int(),
      sendDeltaPercent: z.number().int().nullable(),
      uniqueGyms: z.number().int(),
      sessionCount: z.number().int(),
      workoutMinutesTotal: z.number().int().nullable(),
    }),
    trend: z.object({
      peakBucketKey: z.string().nullable(),
      buckets: z.array(
        z.object({
          key: z.string(),
          sends: z.number().int(),
          label: z.string(),
        }),
      ),
    }),
    difficultyDistribution: z.array(
      z.object({ difficulty: difficultyEnum, count: z.number().int() }),
    ),
    sendAttempt: z.object({
      sendCount: z.number().int(),
      attemptCount: z.number().int(),
      totalRoutes: z.number().int(),
      percent: z.number().int().nullable(),
    }),
    topGyms: z.array(
      z.object({
        gymId: z.string().uuid(),
        name: z.string(),
        address: z.string(),
        coverImageUrl: z.string(),
        visitCount: z.number().int(),
      }),
    ),
    insights: z.array(
      z.object({
        variant: z.enum(["primary", "tertiary"]),
        message: z.string(),
      }),
    ),
  })
  .openapi("MeStatisticsPayload");
