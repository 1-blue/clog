import type {
  Gym,
  GymMembershipPlan,
  MembershipPause,
  UserMembership,
} from "@clog/db";

import type { TMembershipPlanCode } from "@clog/utils";

import {
  computeMembershipValidity,
  isSessionDateWithinMembership,
  type IMembershipPauseRow,
  toSeoulYmd,
} from "#web/libs/membership/membershipDates";

export type TUserMembershipWithRelations = UserMembership & {
  plan: GymMembershipPlan;
  gym: Pick<Gym, "id" | "name" | "membershipBrand">;
  pauses: MembershipPause[];
};

export const serializeUserMembership = (
  row: TUserMembershipWithRelations,
  now: Date = new Date(),
) => {
  const planCode = row.plan.code as TMembershipPlanCode;
  const pauses: IMembershipPauseRow[] = row.pauses.map((p: MembershipPause) => ({
    startDate: p.startDate,
    endDate: p.endDate,
  }));

  const { effectiveEndAt, lastValidYmd } = computeMembershipValidity({
    planCode,
    startedAt: row.startedAt,
    pauses,
  });

  const activeByDate = isSessionDateWithinMembership({
    sessionDate: now,
    startedAt: row.startedAt,
    planCode,
    pauses,
  });

  const isCount = row.remainingUses != null;
  const activeByUses = !isCount || (row.remainingUses ?? 0) > 0;

  const isActive = activeByDate && activeByUses;

  return {
    id: row.id,
    userId: row.userId,
    gymId: row.gymId,
    planId: row.planId,
    startedAt: row.startedAt.toISOString(),
    startedDateYmd: toSeoulYmd(row.startedAt),
    remainingUses: row.remainingUses,
    note: row.note,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    plan: {
      id: row.plan.id,
      code: row.plan.code,
      priceWon: row.plan.priceWon,
      sortOrder: row.plan.sortOrder,
      isActive: row.plan.isActive,
    },
    gym: row.gym,
    pauses: row.pauses.map((p: MembershipPause) => ({
      id: p.id,
      startDateYmd: toSeoulYmd(p.startDate),
      endDateYmd: toSeoulYmd(p.endDate),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    effectiveEndAt: effectiveEndAt.toISOString(),
    lastValidDateYmd: lastValidYmd,
    isActive,
  };
};
