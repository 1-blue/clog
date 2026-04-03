import { differenceInCalendarDays, differenceInCalendarWeeks } from "date-fns";

import { prisma } from "@clog/db";
import type { TMembershipPlanCode } from "@clog/utils";
import { initialUsesForCountPlanCode, isCountPlanCode } from "@clog/utils";

import { errorResponse, json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import {
  computeMembershipValidity,
  toSeoulYmd,
} from "#web/libs/membership/membershipDates";

/** 회원권 사용 기록·통계 (클라이밍 세션 연동) */
export const GET = async (
  _request: Request,
  {
    params,
  }: { params: Promise<{ userMembershipId: string }> },
) => {
  const { userMembershipId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const m = await prisma.userMembership.findFirst({
      where: { id: userMembershipId, userId: userId! },
      include: {
        plan: true,
        gym: { select: { id: true, name: true, membershipBrand: true } },
        pauses: { orderBy: { startDate: "asc" } },
      },
    });
    if (!m) return errorResponse("회원권을 찾을 수 없습니다.", 404);

    const planCode = m.plan.code as TMembershipPlanCode;
    const { lastValidYmd } = computeMembershipValidity({
      planCode,
      startedAt: m.startedAt,
      pauses: m.pauses.map((p) => ({
        startDate: p.startDate,
        endDate: p.endDate,
      })),
    });

    const todayYmd = toSeoulYmd(new Date());
    const remainingDays = Math.max(
      0,
      differenceInCalendarDays(
        new Date(`${lastValidYmd}T12:00:00+09:00`),
        new Date(`${todayYmd}T12:00:00+09:00`),
      ),
    );

    const sessions = await prisma.climbingSession.findMany({
      where: { userId: userId!, userMembershipId },
      orderBy: { date: "desc" },
      include: {
        gym: { select: { id: true, name: true } },
        _count: { select: { routes: true } },
      },
    });

    const totalUsed = sessions.length;
    const weeksSinceStart = Math.max(
      1,
      differenceInCalendarWeeks(new Date(), m.startedAt),
    );
    const weeklyAverage = Math.round((totalUsed / weeksSinceStart) * 10) / 10;

    const initialCount = initialUsesForCountPlanCode(planCode);
    let usageRatePercent: number | null = null;
    if (isCountPlanCode(planCode) && initialCount != null && initialCount > 0) {
      usageRatePercent = Math.min(
        100,
        Math.round((totalUsed / initialCount) * 1000) / 10,
      );
    }

    return json({
      membership: {
        id: m.id,
        gymId: m.gymId,
        planCode,
        startedDateYmd: toSeoulYmd(m.startedAt),
        lastValidDateYmd: lastValidYmd,
        remainingUses: m.remainingUses,
        remainingDays,
        gym: m.gym,
      },
      stats: {
        totalUsed,
        weeklyAverage,
        usageRatePercent,
        initialCount,
      },
      sessions: sessions.map((s) => ({
        id: s.id,
        date: s.date.toISOString(),
        gymName: s.gym.name,
        routeCount: s._count.routes,
      })),
    });
  } catch (e) {
    return catchApiError(_request, e, "사용 내역을 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};
