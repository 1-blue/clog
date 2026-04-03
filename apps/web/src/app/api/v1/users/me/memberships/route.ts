import { prisma, type Prisma } from "@clog/db";
import {
  createUserMembershipBodySchema,
  userMembershipListQuerySchema,
} from "@clog/utils";

import {
  errorResponse,
  getSearchParams,
  json,
  jsonWithToast,
  requireAuth,
} from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";
import {
  initialRemainingUsesForPlan,
  seoulYmdToDate,
} from "#web/libs/membership/membershipDates";
import { serializeUserMembership } from "#web/libs/membership/serializeUserMembership";

const membershipInclude = {
  plan: true,
  gym: { select: { id: true, name: true, membershipBrand: true } },
  pauses: { orderBy: { startDate: "asc" as const } },
} as const;

/** 내 회원권 목록 */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const raw = getSearchParams(request);
    const query = userMembershipListQuerySchema.parse(raw);

    let where: Prisma.UserMembershipWhereInput = { userId: userId! };

    if (query.gymId) {
      const g = await prisma.gym.findUnique({
        where: { id: query.gymId },
        select: { membershipBrand: true },
      });
      if (!g) {
        return errorResponse("암장을 찾을 수 없습니다.", 404);
      }
      where = {
        ...where,
        gym: {
          is: { membershipBrand: g.membershipBrand },
        },
      };
    }

    const rows = await prisma.userMembership.findMany({
      where,
      include: membershipInclude,
      orderBy: { startedAt: "desc" },
    });

    const now = new Date();
    const serialized = rows.map((r) => serializeUserMembership(r, now));
    const filtered =
      query.activeOnly === true
        ? serialized.filter((s) => s.isActive)
        : serialized;

    return json(filtered);
  } catch (e) {
    return catchApiError(request, e, "회원권 목록을 불러올 수 없습니다.", {
      userId: userId!,
    });
  }
};

/** 내 회원권 등록 */
export const POST = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const data = createUserMembershipBodySchema.parse(body);

    const plan = await prisma.gymMembershipPlan.findFirst({
      where: {
        id: data.planId,
        gymId: data.gymId,
        isActive: true,
      },
    });
    if (!plan) {
      return errorResponse("해당 암장의 요금표를 찾을 수 없습니다.", 404);
    }

    const startedAt = seoulYmdToDate(data.startedDateYmd);
    const initial = initialRemainingUsesForPlan(plan.code);

    const row = await prisma.userMembership.create({
      data: {
        userId: userId!,
        gymId: data.gymId,
        planId: plan.id,
        startedAt,
        remainingUses: initial,
        note: data.note,
      },
      include: membershipInclude,
    });

    return jsonWithToast(
      serializeUserMembership(row),
      "회원권을 등록했어요.",
      201,
    );
  } catch (e) {
    return catchApiError(request, e, "회원권 등록에 실패했습니다.", {
      userId: userId!,
    });
  }
};
