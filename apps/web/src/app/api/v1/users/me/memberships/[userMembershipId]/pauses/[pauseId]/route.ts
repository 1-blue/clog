import { prisma } from "@clog/db";
import { patchMembershipPauseBodySchema } from "@clog/utils";

import {
  errorResponse,
  jsonWithToast,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { seoulYmdToDate, toSeoulYmd } from "#web/libs/membership/membershipDates";
import { serializeUserMembership } from "#web/libs/membership/serializeUserMembership";

const membershipInclude = {
  plan: true,
  gym: { select: { id: true, name: true, membershipBrand: true } },
  pauses: { orderBy: { startDate: "asc" as const } },
} as const;

const rangesOverlapInclusive = (
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean => aStart <= bEnd && bStart <= aEnd;

/** 일시정지 수정 */
export const PATCH = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{ userMembershipId: string; pauseId: string }>;
  },
) => {
  const { userMembershipId, pauseId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const membership = await prisma.userMembership.findFirst({
      where: { id: userMembershipId, userId: userId! },
      include: { pauses: true },
    });
    if (!membership) return errorResponse("회원권을 찾을 수 없습니다.", 404);

    const pause = membership.pauses.find((p) => p.id === pauseId);
    if (!pause) return errorResponse("일시정지를 찾을 수 없습니다.", 404);

    const body = await request.json();
    const data = patchMembershipPauseBodySchema.parse(body);

    const nextStart =
      data.startDateYmd ?? toSeoulYmd(pause.startDate);
    const nextEnd = data.endDateYmd ?? toSeoulYmd(pause.endDate);

    if (nextStart > nextEnd) {
      return errorResponse("일시정지 시작일이 종료일보다 늦을 수 없습니다.", 400);
    }

    for (const p of membership.pauses) {
      if (p.id === pauseId) continue;
      const ps = toSeoulYmd(p.startDate);
      const pe = toSeoulYmd(p.endDate);
      if (rangesOverlapInclusive(nextStart, nextEnd, ps, pe)) {
        return errorResponse("이미 일시정지가 겹치는 기간이 있어요.", 400);
      }
    }

    await prisma.membershipPause.update({
      where: { id: pauseId },
      data: {
        ...(data.startDateYmd
          ? { startDate: seoulYmdToDate(data.startDateYmd) }
          : {}),
        ...(data.endDateYmd
          ? { endDate: seoulYmdToDate(data.endDateYmd) }
          : {}),
      },
    });

    const row = await prisma.userMembership.findFirstOrThrow({
      where: { id: userMembershipId },
      include: membershipInclude,
    });

    return jsonWithToast(serializeUserMembership(row), "일시정지를 수정했어요.");
  } catch (e) {
    return catchApiError(request, e, "일시정지 수정에 실패했습니다.", {
      userId: userId!,
    });
  }
};

/** 일시정지 삭제 */
export const DELETE = async (
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ userMembershipId: string; pauseId: string }>;
  },
) => {
  const { userMembershipId, pauseId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const membership = await prisma.userMembership.findFirst({
      where: { id: userMembershipId, userId: userId! },
    });
    if (!membership) return errorResponse("회원권을 찾을 수 없습니다.", 404);

    const pause = await prisma.membershipPause.findFirst({
      where: { id: pauseId, userMembershipId },
    });
    if (!pause) return errorResponse("일시정지를 찾을 수 없습니다.", 404);

    await prisma.membershipPause.delete({ where: { id: pauseId } });

    const row = await prisma.userMembership.findFirstOrThrow({
      where: { id: userMembershipId },
      include: membershipInclude,
    });

    return jsonWithToast(serializeUserMembership(row), "일시정지를 삭제했어요.");
  } catch (e) {
    return catchApiError(_request, e, "일시정지 삭제에 실패했습니다.", {
      userId: userId!,
    });
  }
};
