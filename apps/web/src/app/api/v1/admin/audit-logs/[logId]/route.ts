import { prisma } from "@clog/db/prisma";

import { errorResponse, json, requireAdmin } from "#web/libs/api";
import { catchApiError } from "#web/libs/api/errorCatch";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ logId: string }> },
) => {
  const { error } = await requireAdmin();
  if (error) return error;

  const { logId } = await params;
  try {
    const log = await prisma.adminAuditLog.findUnique({
      where: { id: logId },
      include: {
        actor: { select: { id: true, nickname: true, email: true } },
      },
    });
    if (!log) return errorResponse("감사 로그를 찾을 수 없습니다.", 404);
    return json(log);
  } catch (e) {
    return catchApiError(request, e, "감사 로그를 불러올 수 없습니다.");
  }
};
