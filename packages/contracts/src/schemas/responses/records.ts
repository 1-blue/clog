import { z } from "../../openapi/registry";
import {
  attemptResultEnum,
  difficultyEnum,
  membershipPlanCodeEnum,
  perceivedDifficultyEnum,
} from "../enums";
import { GymDifficultyColor, GymSummary } from "./gyms";
import { AuthorSummary } from "./users.shared";

export const Route = z
  .object({
    id: z.string().uuid(),
    sessionId: z.string().uuid(),
    difficulty: difficultyEnum,
    result: attemptResultEnum,
    attempts: z.number().int(),
    perceivedDifficulty: z
      .union([perceivedDifficultyEnum, z.null()])
      .optional(),
    memo: z.string().nullable().optional(),
    order: z.number().int(),
    createdAt: z.string().datetime(),
  })
  .openapi("Route");

export const CreateRouteBody = z
  .object({
    difficulty: difficultyEnum,
    result: attemptResultEnum,
    attempts: z.number().int().min(1).optional().default(1),
    memo: z.string().max(200).optional(),
  })
  .openapi("CreateRouteBody");

export const CreateSessionBody = z
  .object({
    gymId: z.string().uuid(),
    userMembershipId: z.string().uuid().nullable().optional(),
    gymCheckInId: z.string().uuid().optional(),
    date: z.string().datetime(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    memo: z.string().max(500).optional(),
    isPublic: z.boolean().optional().default(true),
    routes: z.array(CreateRouteBody).optional(),
    imageUrls: z.array(z.string().url()).optional(),
  })
  .openapi("CreateSessionBody");

export const UpdateSessionBody = z
  .object({
    gymCheckInId: z.string().uuid().nullable().optional(),
    date: z.string().datetime().optional(),
    userMembershipId: z.string().uuid().nullable().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    memo: z.string().max(500).nullable().optional(),
    isPublic: z.boolean().optional(),
    routes: z.array(CreateRouteBody).optional(),
    imageUrls: z.array(z.string().url()).optional(),
  })
  .openapi("UpdateSessionBody");

export const RecordListItem = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    gymId: z.string().uuid(),
    userMembershipId: z.string().uuid().nullable().optional(),
    gymCheckInId: z.string().uuid().nullable().optional(),
    date: z.string().datetime(),
    startTime: z.string().datetime().nullable(),
    endTime: z.string().datetime().nullable(),
    memo: z.string().nullable(),
    isPublic: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    gym: GymSummary,
    routes: z.array(Route),
    imageUrls: z.array(z.string().url()),
  })
  .openapi("RecordListItem");

export const RecordUserMembershipSummary = z
  .object({
    id: z.string().uuid(),
    gym: z.object({ id: z.string().uuid(), name: z.string() }),
    plan: z.object({ code: membershipPlanCodeEnum }),
  })
  .openapi("RecordUserMembershipSummary");

export const RecordDetail = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    gymId: z.string().uuid(),
    userMembershipId: z.string().uuid().nullable().optional(),
    gymCheckInId: z.string().uuid().nullable().optional(),
    date: z.string().datetime(),
    startTime: z.string().datetime().nullable(),
    endTime: z.string().datetime().nullable(),
    memo: z.string().nullable(),
    isPublic: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    gym: z.object({
      id: z.string().uuid(),
      name: z.string(),
      address: z.string(),
      logoImageUrl: z.string().nullable().optional(),
    }),
    routes: z.array(Route),
    imageUrls: z.array(z.string().url()),
    user: AuthorSummary,
    userMembership: RecordUserMembershipSummary.nullable().optional(),
  })
  .openapi("RecordDetail");

export const PaginatedRecordListItem = z
  .object({
    items: z.array(RecordListItem),
    nextCursor: z.string().nullable(),
  })
  .openapi("PaginatedRecordListItem");
