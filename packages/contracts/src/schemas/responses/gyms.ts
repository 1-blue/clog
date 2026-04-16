import {
  GymDifficultyColorSchema,
  GymImageSchema,
  GymMembershipPlanSchema,
  GymOpenHourSchema,
  GymSchema,
} from "@clog/db";

import { z } from "../../openapi/registry";
import {
  dayTypeEnum,
  difficultyEnum,
  facilityTypeEnum,
  gymMembershipBrandEnum,
  membershipPlanCodeEnum,
  regionEnum,
} from "../enums";

export const GymImage = GymImageSchema.pick({
  id: true,
  gymId: true,
  url: true,
  order: true,
  createdAt: true,
})
  .extend({
    id: z.string().uuid(),
    gymId: z.string().uuid(),
    url: z.string(),
    order: z.number().int(),
    createdAt: z.string().datetime(),
  })
  .openapi("GymImage");

export const GymOpenHour = GymOpenHourSchema.pick({
  id: true,
  gymId: true,
  dayType: true,
  open: true,
  close: true,
})
  .extend({
    id: z.string().uuid(),
    gymId: z.string().uuid(),
    dayType: dayTypeEnum,
    open: z.string(),
    close: z.string(),
  })
  .openapi("GymOpenHour");

export const GymDifficultyColor = GymDifficultyColorSchema.pick({
  id: true,
  gymId: true,
  difficulty: true,
  color: true,
  label: true,
  order: true,
})
  .extend({
    id: z.string().uuid(),
    gymId: z.string().uuid(),
    difficulty: difficultyEnum,
    color: z.string(),
    label: z.string(),
    order: z.number().int(),
  })
  .openapi("GymDifficultyColor");

export const GymMembershipPlan = GymMembershipPlanSchema.pick({
  id: true,
  gymId: true,
  code: true,
  priceWon: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    id: z.string().uuid(),
    gymId: z.string().uuid(),
    code: membershipPlanCodeEnum,
    priceWon: z.number().int(),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("GymMembershipPlan");

export const GymListItem = GymSchema.pick({
  id: true,
  name: true,
  address: true,
  region: true,
  phone: true,
  notice: true,
  congestion: true,
  visitorCapacity: true,
  latitude: true,
  longitude: true,
  description: true,
  avgRating: true,
  reviewCount: true,
  website: true,
  coverImageUrl: true,
  logoImageUrl: true,
  difficultyImageUrl: true,
  settingScheduleMemo: true,
  instagramId: true,
  createdAt: true,
  updatedAt: true,
  membershipBrand: true,
  facilities: true,
  isClosed: true,
  closedAt: true,
})
  .extend({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    region: regionEnum,
    phone: z.string(),
    notice: z.string().nullable(),
    openHours: z.array(GymOpenHour),
    congestion: z.number().int(),
    visitorCount: z.number().int(),
    monthlyCheckInCount: z.number().int().nullable(),
    visitorCapacity: z.number().int(),
    latitude: z.number(),
    longitude: z.number(),
    description: z.string(),
    avgRating: z.number(),
    reviewCount: z.number().int(),
    website: z.string().nullable(),
    coverImageUrl: z.string(),
    logoImageUrl: z.string(),
    difficultyImageUrl: z.string().nullable(),
    settingScheduleMemo: z.string().nullable(),
    instagramId: z.string().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    membershipBrand: gymMembershipBrandEnum,
    facilities: z.array(facilityTypeEnum),
    images: z.array(GymImage),
    difficultyColors: z.array(GymDifficultyColor).optional(),
    isClosed: z.boolean(),
    closedAt: z.string().datetime().nullable(),
  })
  .openapi("GymListItem");

export const GymDetail = GymListItem.extend({
  membershipPlans: z.array(GymMembershipPlan),
  myCheckIn: z
    .object({
      endsAt: z.string().datetime(),
    })
    .nullable(),
}).openapi("GymDetail");

export const PaginatedGymListItem = z
  .object({
    items: z.array(GymListItem),
    nextCursor: z.string().nullable(),
  })
  .openapi("PaginatedGymListItem");

export const GymSummary = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    logoImageUrl: z.string().nullable(),
    difficultyColors: z.array(GymDifficultyColor),
  })
  .openapi("GymSummary");

export const CheckInResult = z
  .object({
    endsAt: z.string().datetime(),
  })
  .openapi("CheckInResult");

export const CheckOutResult = z
  .object({
    ok: z.boolean(),
    createdSessionId: z.string().uuid().nullable(),
  })
  .openapi("CheckOutResult");

export const MyCheckInItem = z
  .object({
    id: z.string().uuid(),
    gymId: z.string().uuid(),
    gymName: z.string(),
    startedAt: z.string().datetime(),
    endsAt: z.string().datetime().optional(),
    endedAt: z.string().datetime().nullable().optional(),
  })
  .openapi("MyCheckInItem");
