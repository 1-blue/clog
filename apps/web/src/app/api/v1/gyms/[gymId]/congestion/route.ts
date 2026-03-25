import { prisma } from "@clog/db";

import { errorResponse, json } from "#web/libs/api";

/** 시간대별 혼잡도 */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ gymId: string }> },
) => {
  const { gymId } = await params;

  try {
    const logs = await prisma.congestionLog.findMany({
      where: { gymId },
      orderBy: [{ dayOfWeek: "asc" }, { hour: "asc" }],
    });

    return json(logs);
  } catch {
    return errorResponse("혼잡도 데이터를 불러올 수 없습니다.");
  }
};
