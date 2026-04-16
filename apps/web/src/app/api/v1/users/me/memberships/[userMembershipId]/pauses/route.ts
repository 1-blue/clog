import { createMembershipPauseBodySchema } from "@clog/contracts";
import { prisma } from "@clog/db/prisma";

import { errorResponse, jsonWithToast, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import {
  seoulYmdToDate,
  toSeoulYmd,
} from "#web/libs/membership/membershipDates";
import { serializeUserMembership } from "#web/libs/membership/serializeUserMembership";

const membershipInclude = {
  plan: true,
  gym: { select: { id: true, name: true, membershipBrand: true } },
  pauses: { orderBy: { startDate: "asc" as const } },
} as const;

/** 구간 겹침 (양끝 포함) */
const rangesOverlapInclusive = (
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean => aStart <= bEnd && bStart <= aEnd;

/** 일시정지 추가 */
export const POST = async (
  request: Request,
  { params }: { params: Promise<{ userMembershipId: string }> },
) => {
  const { userMembershipId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const membership = await prisma.userMembership.findFirst({
      where: { id: userMembershipId, userId: userId! },
      include: { pauses: true },
    });
    if (!membership) return errorResponse("회원권을 찾을 수 없습니다.", 404);

    const body = await request.json();
    const data = createMembershipPauseBodySchema.parse(body);

    if (data.startDateYmd > data.endDateYmd) {
      return errorResponse(
        "일시정지 시작일이 종료일보다 늦을 수 없습니다.",
        400,
      );
    }

    for (const p of membership.pauses) {
      const ps = toSeoulYmd(p.startDate);
      const pe = toSeoulYmd(p.endDate);
      if (rangesOverlapInclusive(data.startDateYmd, data.endDateYmd, ps, pe)) {
        return errorResponse("이미 일시정지가 겹치는 기간이 있어요.", 400);
      }
    }

    await prisma.membershipPause.create({
      data: {
        userMembershipId,
        startDate: seoulYmdToDate(data.startDateYmd),
        endDate: seoulYmdToDate(data.endDateYmd),
      },
    });

    const row = await prisma.userMembership.findFirstOrThrow({
      where: { id: userMembershipId },
      include: membershipInclude,
    });

    return jsonWithToast(
      serializeUserMembership(row),
      "일시정지를 추가했어요.",
      201,
    );
  } catch (e) {
    return catchApiError(request, e, "일시정지 추가에 실패했습니다.", {
      userId: userId!,
    });
  }
};
