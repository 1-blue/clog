import type { Prisma } from "@clog/db";

import { sessionDateForValidation } from "#web/libs/membership/sessionMembership";

/** 체크인 구간이 기록(자동 생성·연결)에 쓰이기 위한 최소 시간 */
export const CHECKIN_MIN_SESSION_MS = 30 * 60 * 1000;

export const isCheckInEligibleForSession = (
  startedAt: Date,
  endedAt: Date,
): boolean =>
  endedAt.getTime() - startedAt.getTime() >= CHECKIN_MIN_SESSION_MS;

type TTx = Omit<
  Prisma.TransactionClient,
  "$connect" | "$disconnect" | "$transaction" | "$extends"
>;

/** 체크인으로부터 세션 생성 (30분 미만·이미 연결됨이면 null) */
export const createSessionFromCheckInIfEligible = async (
  tx: TTx,
  input: {
    checkInId: string;
    userId: string;
    gymId: string;
    startedAt: Date;
    endedAt: Date;
  },
): Promise<{ id: string } | null> => {
  if (!isCheckInEligibleForSession(input.startedAt, input.endedAt)) {
    return null;
  }

  const existing = await tx.climbingSession.findUnique({
    where: { gymCheckInId: input.checkInId },
    select: { id: true },
  });
  if (existing) return null;

  const sessionDate = sessionDateForValidation(input.startedAt);

  return tx.climbingSession.create({
    data: {
      userId: input.userId,
      gymId: input.gymId,
      date: sessionDate,
      startTime: input.startedAt,
      endTime: input.endedAt,
      gymCheckInId: input.checkInId,
    },
    select: { id: true },
  });
};

/** 수동 기록 생성·수정 시 gymCheckInId 연결 검증 */
export const assertGymCheckInLinkable = async (
  tx: TTx,
  input: {
    userId: string;
    gymCheckInId: string;
    gymId: string;
    excludeSessionId?: string;
  },
): Promise<void> => {
  const checkIn = await tx.gymCheckIn.findFirst({
    where: { id: input.gymCheckInId, userId: input.userId },
  });
  if (!checkIn) {
    throw new Error("CHECKIN_NOT_FOUND");
  }
  if (checkIn.gymId !== input.gymId) {
    throw new Error("CHECKIN_GYM_MISMATCH");
  }
  if (!checkIn.endedAt) {
    throw new Error("CHECKIN_NOT_ENDED");
  }
  if (!isCheckInEligibleForSession(checkIn.startedAt, checkIn.endedAt)) {
    throw new Error("CHECKIN_TOO_SHORT");
  }

  const linked = await tx.climbingSession.findUnique({
    where: { gymCheckInId: input.gymCheckInId },
    select: { id: true },
  });
  if (linked && linked.id !== input.excludeSessionId) {
    throw new Error("CHECKIN_ALREADY_LINKED");
  }
};

export const gymCheckInLinkErrorMessage = (e: unknown): string | null => {
  if (!(e instanceof Error)) return null;
  switch (e.message) {
    case "CHECKIN_NOT_FOUND":
      return "체크인을 찾을 수 없습니다.";
    case "CHECKIN_GYM_MISMATCH":
      return "선택한 암장이 체크인 암장과 일치하지 않습니다.";
    case "CHECKIN_NOT_ENDED":
      return "종료된 체크인만 연결할 수 있습니다.";
    case "CHECKIN_TOO_SHORT":
      return "체크인 30분 이상인 경우만 연결할 수 있습니다.";
    case "CHECKIN_ALREADY_LINKED":
      return "이미 다른 기록에 연결된 체크인입니다.";
    default:
      return null;
  }
};
