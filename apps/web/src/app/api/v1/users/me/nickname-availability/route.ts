import { prisma } from "@clog/db";
import { nicknameAvailabilityQuerySchema } from "@clog/utils";

import { errorResponse, getSearchParams, json, requireAuth } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

/** 닉네임 사용 가능 여부 (본인 현재 닉네임은 항상 사용 가능으로 간주) */
export const GET = async (request: Request) => {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const raw = getSearchParams(request);
    const parsed = nicknameAvailabilityQuerySchema.safeParse({
      nickname: raw.nickname ?? "",
    });
    if (!parsed.success) {
      return errorResponse("닉네임은 1~20자로 입력해 주세요.");
    }
    const { nickname } = parsed.data;

    const me = await prisma.user.findUnique({
      where: { id: userId! },
      select: { nickname: true },
    });
    if (!me) return errorResponse("유저를 찾을 수 없습니다.", 404);

    if (nickname === me.nickname) {
      return json({ available: true });
    }

    const taken = await prisma.user.findFirst({
      where: { nickname },
      select: { id: true },
    });

    return json({ available: !taken });
  } catch (error) {
    return catchApiError(request, error, "닉네임 확인에 실패했습니다.", {
      userId: userId!,
    });
  }
};
