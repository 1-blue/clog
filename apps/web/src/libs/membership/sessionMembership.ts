import { isCountPlanCode, type TMembershipPlanCode } from "@clog/contracts";
import type { MembershipPause, Prisma } from "@clog/db";

import {
  isSessionDateWithinMembership,
  toSeoulYmd,
} from "#web/libs/membership/membershipDates";

type TTx = Omit<
  Prisma.TransactionClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

/** 세션(기록) 암장과 동일 브랜드면 허용. STANDALONE은 구매 지점 = 세션 지점만 허용 */
export const loadMembershipForUser = async (
  tx: TTx,
  input: { id: string; userId: string; gymId: string },
) => {
  const [m, sessionGym] = await Promise.all([
    tx.userMembership.findFirst({
      where: { id: input.id, userId: input.userId },
      include: { plan: true, pauses: true, gym: true },
    }),
    tx.gym.findUnique({
      where: { id: input.gymId },
      select: { id: true, membershipBrand: true },
    }),
  ]);

  if (!m || !sessionGym) return null;

  const purchaseBrand = m.gym.membershipBrand;
  if (purchaseBrand !== sessionGym.membershipBrand) return null;
  if (purchaseBrand === "STANDALONE" && m.gymId !== sessionGym.id) return null;

  return m;
};

/** 기록 생성 시: 검증 후 횟수권이면 remainingUses 1 감소 */
export const applyMembershipOnSessionCreate = async (
  tx: TTx,
  input: {
    userId: string;
    gymId: string;
    sessionDate: Date;
    userMembershipId: string | null | undefined;
  },
): Promise<string | null> => {
  const { userId, gymId, sessionDate, userMembershipId } = input;
  if (!userMembershipId) return null;

  const m = await loadMembershipForUser(tx, {
    id: userMembershipId,
    userId,
    gymId,
  });
  if (!m) {
    throw new Error("MEMBERSHIP_NOT_FOUND");
  }

  const planCode = m.plan.code as TMembershipPlanCode;
  const ok = isSessionDateWithinMembership({
    sessionDate,
    startedAt: m.startedAt,
    planCode,
    pauses: m.pauses.map((p: MembershipPause) => ({
      startDate: p.startDate,
      endDate: p.endDate,
    })),
  });
  if (!ok) {
    throw new Error("MEMBERSHIP_DATE_INVALID");
  }

  if (isCountPlanCode(planCode)) {
    const ru = m.remainingUses ?? 0;
    if (ru < 1) {
      throw new Error("MEMBERSHIP_USES_EXHAUSTED");
    }
    await tx.userMembership.update({
      where: { id: m.id },
      data: { remainingUses: { decrement: 1 } },
    });
  }

  return m.id;
};

/** 기록 삭제 시: 횟수권 연결이 있으면 잔여 +1 */
export const refundMembershipOnSessionDelete = async (
  tx: TTx,
  input: { userMembershipId: string | null },
) => {
  if (!input.userMembershipId) return;

  const m = await tx.userMembership.findUnique({
    where: { id: input.userMembershipId },
    include: { plan: true },
  });
  if (!m) return;

  const planCode = m.plan.code as TMembershipPlanCode;
  if (isCountPlanCode(planCode)) {
    await tx.userMembership.update({
      where: { id: m.id },
      data: { remainingUses: { increment: 1 } },
    });
  }
};

/** PATCH: membership 연결 변경 시 횟수권 잔여 조정 */
export const adjustMembershipOnSessionPatch = async (
  tx: TTx,
  input: {
    userId: string;
    gymId: string;
    sessionDate: Date;
    previousMembershipId: string | null;
    /** null이면 연결 해제 (undefined는 호출부에서 처리하지 않음) */
    nextMembershipId: string | null;
  },
) => {
  const { previousMembershipId, nextMembershipId } = input;
  if (previousMembershipId === nextMembershipId) return;

  if (previousMembershipId) {
    await refundMembershipOnSessionDelete(tx, {
      userMembershipId: previousMembershipId,
    });
  }

  if (!nextMembershipId) return;

  await applyMembershipOnSessionCreate(tx, {
    userId: input.userId,
    gymId: input.gymId,
    sessionDate: input.sessionDate,
    userMembershipId: nextMembershipId,
  });
};

export const sessionDateForValidation = (date: Date): Date => {
  const ymd = toSeoulYmd(date);
  return new Date(`${ymd}T12:00:00+09:00`);
};

/** 기록에 이미 연결된 회원권에 대해 방문일만 바꿀 때 — 유효 기간만 검사 (잔여 횟수는 소비 없음) */
export const assertMembershipDateValidForSession = async (
  tx: TTx,
  input: {
    userId: string;
    gymId: string;
    sessionDate: Date;
    userMembershipId: string;
  },
) => {
  const m = await loadMembershipForUser(tx, {
    id: input.userMembershipId,
    userId: input.userId,
    gymId: input.gymId,
  });
  if (!m) {
    throw new Error("MEMBERSHIP_NOT_FOUND");
  }
  const planCode = m.plan.code as TMembershipPlanCode;
  const ok = isSessionDateWithinMembership({
    sessionDate: input.sessionDate,
    startedAt: m.startedAt,
    planCode,
    pauses: m.pauses.map((p: MembershipPause) => ({
      startDate: p.startDate,
      endDate: p.endDate,
    })),
  });
  if (!ok) {
    throw new Error("MEMBERSHIP_DATE_INVALID");
  }
};
