import { prisma } from "@clog/db";

import { errorResponse, json } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 암장 회원권 요금표(템플릿) 목록 — 비로그인 조회 가능 */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { gymId } = await params;

  try {
    const gym = await prisma.gym.findUnique({
      where: { id: gymId },
      select: { id: true },
    });
    if (!gym) return errorResponse("암장을 찾을 수 없습니다.", 404);

    const plans = await prisma.gymMembershipPlan.findMany({
      where: { gymId, isActive: true },
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
    });

    return json(plans);
  } catch (error) {
    return catchApiError(_request, error, "요금표를 불러올 수 없습니다.");
  }
};
