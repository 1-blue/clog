import { prisma } from "@clog/db";
import { patchUserMembershipBodySchema } from "@clog/utils";

import {
  errorResponse,
  json,
  jsonWithToast,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import { seoulYmdToDate } from "#web/libs/membership/membershipDates";
import { serializeUserMembership } from "#web/libs/membership/serializeUserMembership";

const membershipInclude = {
  plan: true,
  gym: { select: { id: true, name: true, membershipBrand: true } },
  pauses: { orderBy: { startDate: "asc" as const } },
} as const;

/** 내 회원권 상세 */
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
    const row = await prisma.userMembership.findFirst({
      where: { id: userMembershipId, userId: userId! },
      include: membershipInclude,
    });
    if (!row) return errorResponse("회원권을 찾을 수 없습니다.", 404);

    return json(serializeUserMembership(row));
  } catch (e) {
    return catchApiError(_request, e, "회원권을 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};

/** 내 회원권 수정 */
export const PATCH = async (
  request: Request,
  {
    params,
  }: { params: Promise<{ userMembershipId: string }> },
) => {
  const { userMembershipId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.userMembership.findFirst({
      where: { id: userMembershipId, userId: userId! },
    });
    if (!existing) return errorResponse("회원권을 찾을 수 없습니다.", 404);

    const body = await request.json();
    const data = patchUserMembershipBodySchema.parse(body);

    const row = await prisma.userMembership.update({
      where: { id: userMembershipId },
      data: {
        ...(data.note !== undefined && { note: data.note }),
        ...(data.startedDateYmd
          ? { startedAt: seoulYmdToDate(data.startedDateYmd) }
          : {}),
      },
      include: membershipInclude,
    });

    return jsonWithToast(serializeUserMembership(row), "저장했어요.");
  } catch (e) {
    return catchApiError(request, e, "회원권 수정에 실패했습니다.", {
      userId: userId!,
    });
  }
};

/** 내 회원권 삭제 */
export const DELETE = async (
  _request: Request,
  {
    params,
  }: { params: Promise<{ userMembershipId: string }> },
) => {
  const { userMembershipId } = await params;
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const existing = await prisma.userMembership.findFirst({
      where: { id: userMembershipId, userId: userId! },
    });
    if (!existing) return errorResponse("회원권을 찾을 수 없습니다.", 404);

    await prisma.userMembership.delete({ where: { id: userMembershipId } });

    return jsonWithToast({ ok: true }, "회원권을 삭제했어요.");
  } catch (e) {
    return catchApiError(_request, e, "회원권 삭제에 실패했습니다.", {
      userId: userId!,
    });
  }
};
